import { z } from 'zod'
export const ChannelTypeEnum = z.enum(['call', 'text'])