import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './account.decorator';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AccountDTO } from './account.dto';
import { plainToInstance } from 'class-transformer';
import { Contact } from './schemas/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<Account>,
    @InjectModel('Contact')
    private contactModel: Model<any>,
  ) {}

  async findAll(): Promise<AccountDTO[]> {
    let accounts = await this.accountModel
      .find()
      .sort({ created_at: -1 })
      .exec();
    return accounts.map((c) =>
      plainToInstance(AccountDTO, c.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<Account | null> {
    return this.accountModel.findOne({ username }).exec();
  }

  async create(account: Account): Promise<boolean> {
    try {
      await this.accountModel.create(account);
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

  async update(id: string, account: Partial<Account>): Promise<Account> {
    const updated = await this.accountModel.findByIdAndUpdate(
      id,
      { $set: account },
      { new: true, runValidators: true },
    );
    if (!updated) {
      throw new NotFoundException('Account Not Found');
    }
    return updated;
  }

  async login(username: string, password: string): Promise<Account | null> {
    const account = await this.accountModel.findOne({ username }).exec();
    if (
      account &&
      account.is_active &&
      bcrypt.compareSync(password, account.password)
    ) {
      return account;
    }
    return null;
  }

  async findById(id: string): Promise<Account> {
    return this.accountModel.findById(id).exec();
  }

  async setSecurityCode(email: string, code: string) {
    const acc = await this.accountModel.findOne({ email }).exec();
    if (acc) {
      acc.securityCode = code;
      await acc.save();
    }
  }

  // account.service.ts
  async delete(id: string): Promise<boolean> {
    try {
      const res = await this.accountModel.findByIdAndDelete(id);
      return !!res;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Contact-related methods (for About/Contact pages)
  async createContact(data: Partial<Contact>): Promise<any> {
    const contact = new this.contactModel({ ...data, role: 'user' });
    return contact.save();
  }

  async findAllContacts(): Promise<any[]> {
    return this.contactModel.find({ role: 'user' }).sort({ createdAt: -1 }).exec();
  }

  async findAdminInfo(): Promise<any> {
    return this.contactModel.findOne({ role: 'admin' }).exec();
  }

  // optional initializer to create sample admin if not exists
  async initializeAdminData(): Promise<void> {
    const admin = await this.contactModel.findOne({ role: 'admin' }).exec();
    if (!admin) {
      await this.contactModel.create({
        name: 'KAS Company',
        email: 'info@kas.com',
        phone: '0123456789',
        message:
          'KAS provides professional software deployment and IT solutions.',
        facebook: 'https://facebook.com/kas.company',
        zalo: 'https://zalo.me/0123456789',
        role: 'admin',
      });
    }
  }
}
