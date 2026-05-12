import { JsonController, Post, Body, Req, UseBefore ,Get } from "routing-controllers";
import { ContactService } from "../services/ContactService";
import { ContactDTO } from "../dto/AuthDTO";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
@JsonController("/contact")
export class ContactController {
  private service = new ContactService();
  @Post("/")
  async create(@Body() body: ContactDTO) {
    const contact = await this.service.createContact(
      body.full_name,
      body.email,
      body.message
    );

    return {
      success: true,
      message: "Contact submitted successfully",
      data: contact
    };
  }

  @Get("/")
  @UseBefore(AuthMiddleware)
  async getAll() {
    const contacts = await this.service.getAllContacts();
    return { success: true, data: contacts };
  }
}