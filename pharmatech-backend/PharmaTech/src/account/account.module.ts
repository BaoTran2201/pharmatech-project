import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './account.decorator';
import { MailService } from 'src/mail/mail.service';
import { ContactSchema } from './schemas/account.schema';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
      {
        name: 'Contact',
        schema: ContactSchema,
      },
    ]),
  ],
  providers: [AccountService, MailService],
  controllers: [AccountController, AccountsController],
  exports: [AccountService, MailService],
})
export class AccountModule {}
