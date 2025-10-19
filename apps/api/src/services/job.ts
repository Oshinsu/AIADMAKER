import { getDatabase } from '../lib/database'
import { logger } from '../lib/logger'

export class JobService {
  private db = getDatabase()

  async getJob(id: string) {
    return await this.db.job.findUnique({
      where: { id },
      include: {
        workflow: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assets: true,
      },
    })
  }

  async listJobs(options: {
    limit: number
    offset: number
    status?: string
    workflowId?: string
  }) {
    const where: any = {}
    
    if (options.status) {
      where.status = options.status.toUpperCase()
    }
    
    if (options.workflowId) {
      where.workflowId = options.workflowId
    }

    const [jobs, total] = await Promise.all([
      this.db.job.findMany({
        where,
        skip: options.offset,
        take: options.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { assets: true },
          },
        },
      }),
      this.db.job.count({ where }),
    ])

    return {
      jobs,
      total,
      limit: options.limit,
      offset: options.offset,
    }
  }

  async cancelJob(id: string) {
    const job = await this.db.job.findUnique({
      where: { id },
    })

    if (!job) {
      return false
    }

    if (job.status === 'COMPLETED' || job.status === 'FAILED' || job.status === 'CANCELLED') {
      return false
    }

    await this.db.job.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    })

    logger.info('Job cancelled', { jobId: id })
    return true
  }

  async retryJob(id: string) {
    const job = await this.db.job.findUnique({
      where: { id },
      include: { workflow: true },
    })

    if (!job) {
      return false
    }

    if (job.status !== 'FAILED') {
      return false
    }

    // Create new job with same parameters
    const newJob = await this.db.job.create({
      data: {
        workflowId: job.workflowId,
        status: 'PENDING',
        priority: job.priority,
        inputs: job.inputs,
        userId: job.userId,
      },
    })

    logger.info('Job retried', { originalJobId: id, newJobId: newJob.id })
    return true
  }

  async getJobLogs(id: string) {
    const job = await this.db.job.findUnique({
      where: { id },
      select: { logs: true },
    })

    if (!job) {
      return null
    }

    return { logs: job.logs || [] }
  }

  async getJobResults(id: string) {
    const job = await this.db.job.findUnique({
      where: { id },
      select: { results: true, status: true },
    })

    if (!job) {
      return null
    }

    if (job.status !== 'COMPLETED') {
      return null
    }

    return job.results
  }

  async updateJobStatus(id: string, status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED', data?: any) {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (status === 'RUNNING' && !data?.startedAt) {
      updateData.startedAt = new Date()
    }

    if (status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED') {
      updateData.completedAt = new Date()
    }

    if (data?.results) {
      updateData.results = data.results
    }

    if (data?.error) {
      updateData.error = data.error
    }

    if (data?.logs) {
      updateData.logs = data.logs
    }

    return await this.db.job.update({
      where: { id },
      data: updateData,
    })
  }
}
