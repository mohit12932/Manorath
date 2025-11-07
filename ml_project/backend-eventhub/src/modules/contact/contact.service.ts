import { prisma } from '../../db/prisma';
import { Contact, Prisma } from '@prisma/client';
import { logger } from '../../config/logger';
import { parsePaginationParams, createPaginatedResponse, PaginatedResponse } from '../../utils/response';

export class ContactService {
  async listContacts(
    userId: string,
    params: { page?: number; pageSize?: number; q?: string }
  ): Promise<PaginatedResponse<Contact>> {
    const { page, pageSize, skip } = parsePaginationParams(params.page, params.pageSize);

    const where: Prisma.ContactWhereInput = { userId };

    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { email: { contains: params.q, mode: 'insensitive' } },
        { phone: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.contact.count({ where });
    const contacts = await prisma.contact.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return createPaginatedResponse(contacts, page, pageSize, total);
  }

  async getContactById(contactId: string, userId: string): Promise<Contact | null> {
    return await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });
  }

  async createContact(
    userId: string,
    data: { name: string; email?: string | null; phone?: string | null; notes?: string | null }
  ): Promise<Contact> {
    const contact = await prisma.contact.create({
      data: { ...data, userId },
    });

    logger.info({ contactId: contact.id, userId }, 'Contact created');
    return contact;
  }

  async updateContact(
    contactId: string,
    userId: string,
    data: { name?: string; email?: string | null; phone?: string | null; notes?: string | null }
  ): Promise<Contact> {
    const contact = await this.getContactById(contactId, userId);
    if (!contact) throw new Error('Contact not found');

    const updated = await prisma.contact.update({
      where: { id: contactId },
      data,
    });

    logger.info({ contactId, userId }, 'Contact updated');
    return updated;
  }

  async deleteContact(contactId: string, userId: string): Promise<void> {
    const contact = await this.getContactById(contactId, userId);
    if (!contact) throw new Error('Contact not found');

    await prisma.contact.delete({ where: { id: contactId } });
    logger.info({ contactId, userId }, 'Contact deleted');
  }
}

export const contactService = new ContactService();
