import { JsonController, Post, Body, Req, UseBefore } from "routing-controllers";
import { ContactService } from "../services/ContactService";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { ContactDTO } from "../dto/AuthDTO";
@JsonController("/contact")
@UseBefore(AuthMiddleware)
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
}