using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using api.DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;

namespace api
{
    public static class SendEmailFunction
    {
        [FunctionName("SendEmailFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequest req,
            ILogger log)
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<ClientData>(requestBody, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var emailApiKey = Environment.GetEnvironmentVariable("EMAIL_API_KEY");

            Configuration.Default.AddApiKey("api-key", emailApiKey);
            var apiInstance = new TransactionalEmailsApi();
            var sendSmtpEmail = new SendSmtpEmail
            {
                TemplateId = 1,
                Sender = new SendSmtpEmailSender(data.UserName, data.Email),
                Params = new {MESSAGE = data.Message},
                To = new List<SendSmtpEmailTo>(
                    new[] {new SendSmtpEmailTo("duarte.gledson@gmail.com", "Gledson Duarte")}),
            };

            try
            {
                var result = await apiInstance.SendTransacEmailAsync(sendSmtpEmail);
                return new OkObjectResult(new {result.MessageId});
            }
            catch (Exception e)
            {
                return new BadRequestResult();
            }
        }
    }
}