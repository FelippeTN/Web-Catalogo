import { httpClient } from './httpClient'
import type { Plan, UserPlanInfo } from './types'

export const plansService = {
  async getAll(): Promise<Plan[]> {
    const response = await httpClient.get<Plan[]>('/public/plans')
    return response
  },

  async getMyPlanInfo(): Promise<UserPlanInfo> {
    const response = await httpClient.get<UserPlanInfo>('/protected/my-plan')
    return response
  },

  async upgradePlan(planId: number): Promise<{ message: string; plan: Plan }> {
    const response = await httpClient.post<{ message: string; plan: Plan }>('/protected/upgrade-plan', { plan_id: planId })
    return response
  },

  async createPaymentIntent(amount: number, currency: string): Promise<{ clientSecret: string }> {
    const response = await httpClient.post<{ clientSecret: string }>('/protected/create-payment-intent', { amount, currency })
    return response
  },
}
