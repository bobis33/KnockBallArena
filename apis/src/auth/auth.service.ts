import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, password: string, name: string): Promise<User> {
    return this.prisma.user.create({
      data: { email, password, name },
    })
  }
}
