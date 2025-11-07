import { Router } from 'express';
import { listContacts, getContact, createContact, updateContact, deleteContact } from './contact.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate, validateMultiple } from '../../middleware/validate.middleware';
import { createContactSchema, updateContactSchema, contactIdSchema, listContactsQuerySchema } from './contact.validation';

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: List user contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contacts retrieved
 */
router.get('/', validate(listContactsQuerySchema, 'query'), listContacts);
router.get('/:id', validate(contactIdSchema, 'params'), getContact);
router.post('/', validate(createContactSchema), createContact);
router.put('/:id', validateMultiple({ params: contactIdSchema, body: updateContactSchema }), updateContact);
router.delete('/:id', validate(contactIdSchema, 'params'), deleteContact);

export default router;
