import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Role } from "../../common/enums/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column("simple-array")
  roles!: Role[];

  @ManyToOne(() => User, (user) => user.customers, { nullable: true })
  creditOfficer?: User;

  @OneToMany(() => User, (user) => user.creditOfficer)
  customers!: User[];
}
