import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id: number;

  @Column({type: 'text', default: '', nullable: true})
  email?: string;

  @Column({ type: 'text', nullable: true})
  fullname?: string;

  @Column({ type: 'text' })
  login?: string;

  @Column({ type: 'text', default: '' , nullable: true})
  avatar?: string;

  @Column('int', { array: true, default: [] , nullable: true})
  friendList?: number[];

  @Column('int', { array: true, default: [] , nullable: true})
  roomList?: number[];

  // Change this to enum type maybe
  @Column({ default: false })
  status?: boolean;

  @Column()
  statsId?: number;

  @Column({ default: 0 })
  matchHistoryId?: number;

  @Column({ default: false })
  is2fa?: boolean;

  @Column({ type: 'varchar', default: '' })
  token?: string;

  @Column({ type: 'boolean', default: false})
  isFirst?: boolean;

  @Column('int', { array: true, default: [] })
  blockedUsers?: number[];

  // in_game: boolean 
  @Column({ default: false})
  inGame?: boolean;

// logged: boolean
  @Column({ default: false})
  isLogged?: boolean;

  @Column({select: false, nullable: true})
  authConfirmToken?: string
}
