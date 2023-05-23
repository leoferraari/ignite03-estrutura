
import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export class RegisterUserCase {

    constructor(private usersRepository: UsersRepository) {}
    
    async execute({    name,    email,     password, }: RegisterUseCaseRequest) {
     
        const userWithSameEmail = await this.usersRepository.findByEmail(email)
    
        if (userWithSameEmail) {
            throw new Error('E-mail already exists.')
        }
    
        const password_hash = await hash(password, 6)
    
        await this.usersRepository.create({
            name,
            email,
            password_hash,
        })
    }
}
