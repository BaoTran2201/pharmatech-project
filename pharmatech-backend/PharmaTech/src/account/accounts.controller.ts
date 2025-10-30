import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('api/accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountService) {}

  @Post('contact')
  async createContact(@Body() dto: CreateContactDto) {
    return this.accountService.createContact(dto);
  }

  @Get('contact')
  async getAllContacts() {
    return this.accountService.findAllContacts();
  }

  @Get('about')
  async getAbout() {
    return this.accountService.findAdminInfo();
  }
}
