import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ collection: 'accounts' })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  message: string;

  @Prop()
  facebook: string;

  @Prop()
  zalo: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);