import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "./users.service";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { Role } from "../common/enums/role.enum";

@Controller("users") // Defines the base route path for all endpoints in this controller as /users
@UseGuards(FirebaseAuthGuard, RolesGuard) // Applies authentication and role-based authorization guards globally to all routes
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // Injects the UsersService to handle business logic

  /**
   * GET /users/customers
   * Endpoint for Credit Officers to get customers assigned to them
   * Protected by Firebase authentication and role guard allowing only CREDIT_OFFICER role
   */
  @Get("customers")
  @Roles(Role.CREDIT_OFFICER) // Role-based access control allowing only users with CREDIT_OFFICER role
  async getAssignedCustomers(@Req() req: Request) {
    // Extracts the authenticated Credit Officer's user ID from the Firebase-verified request user object
    const creditOfficerId = (req.user as any)?.uid;

    // Calls the service to fetch customers assigned to this credit officer
    return this.usersService.findCustomersByCreditOfficer(creditOfficerId);
  }

  /**
   * GET /users
   * Endpoint for Admins and Branch Managers to retrieve all users
   */
  @Get()
  @Roles(Role.ADMIN, Role.BRANCH_MANAGER) // Only accessible by Admin and Branch Manager roles
  async getAllUsers() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Endpoint for Admins, Branch Managers, and Credit Officers to get a single user by ID
   */
  @Get(":id")
  @Roles(Role.ADMIN, Role.BRANCH_MANAGER, Role.CREDIT_OFFICER) // Accessible by multiple roles
  async getUserById(@Req() req: Request) {
    // Extracts the 'id' parameter from the URL
    const userId = req.params.id;

    // Calls service method to fetch user details by ID
    return this.usersService.findOneById(userId);
  }
}
