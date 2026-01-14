// src/users/users.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findCustomersByCreditOfficer(creditOfficerId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { creditOfficer: { id: creditOfficerId } },
      relations: ["creditOfficer"],
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async assignCreditOfficer(
    customerId: string,
    creditOfficerId: string
  ): Promise<User> {
    const customer = await this.findOneById(customerId);
    const creditOfficer = await this.findOneById(creditOfficerId);
    if (!customer || !creditOfficer) {
      throw new Error("User(s) not found");
    }
    customer.creditOfficer = creditOfficer;
    return this.userRepository.save(customer);
  }
}
