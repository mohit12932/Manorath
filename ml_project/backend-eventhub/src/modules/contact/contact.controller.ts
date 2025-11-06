import { Request, Response } from 'express';
import { contactService } from './contact.service';
import { sendSuccess, sendError, ErrorCodes } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { logger } from '../../config/logger';

export const listContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { page, pageSize, q } = req.query;
    const result = await contactService.listContacts(authReq.user.id, {
      page: page as number | undefined,
      pageSize: pageSize as number | undefined,
      q: q as string | undefined,
    });

    sendSuccess(res, result);
  } catch (error) {
    logger.error({ error }, 'List contacts failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to list contacts', 500);
  }
};

export const getContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const contact = await contactService.getContactById(id, authReq.user.id);

    if (!contact) {
      sendError(res, ErrorCodes.NOT_FOUND, 'Contact not found', 404);
      return;
    }

    sendSuccess(res, contact);
  } catch (error) {
    logger.error({ error }, 'Get contact failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to get contact', 500);
  }
};

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const contact = await contactService.createContact(authReq.user.id, req.body);
    sendSuccess(res, contact, 201);
  } catch (error) {
    logger.error({ error }, 'Create contact failed');
    sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to create contact', 500);
  }
};

export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const contact = await contactService.updateContact(id, authReq.user.id, req.body);
    sendSuccess(res, contact);
  } catch (error) {
    logger.error({ error }, 'Update contact failed');
    const message = error instanceof Error ? error.message : 'Failed to update contact';
    if (message.includes('not found')) {
      sendError(res, ErrorCodes.NOT_FOUND, message, 404);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to update contact', 500);
    }
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    await contactService.deleteContact(id, authReq.user.id);
    sendSuccess(res, { message: 'Contact deleted successfully' });
  } catch (error) {
    logger.error({ error }, 'Delete contact failed');
    const message = error instanceof Error ? error.message : 'Failed to delete contact';
    if (message.includes('not found')) {
      sendError(res, ErrorCodes.NOT_FOUND, message, 404);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, 'Failed to delete contact', 500);
    }
  }
};
