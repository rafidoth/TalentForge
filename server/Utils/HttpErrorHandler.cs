
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.ServiceResults;

namespace server.Utils
{
    public class HttpErrorHandler<T>(ServiceResult<T> result) : IActionResult
    {
        public async Task ExecuteResultAsync(ActionContext context)
        {
            ObjectResult objectResult = result.IsSuccess
                ? new ObjectResult(new { result.Data, result.Message }) { StatusCode = 200 }
                : new ObjectResult(new { result.Message, result.ErrorCode })
                {
                    StatusCode = result.ErrorCode switch
                    {
                        ErrorCodes.NotFound => 404,
                        ErrorCodes.ValidationError => 400,
                        ErrorCodes.Unauthorized => 401,
                        ErrorCodes.Forbidden => 403,
                        ErrorCodes.Conflict => 409,
                        _ => 500
                    }
                };

            await objectResult.ExecuteResultAsync(context);
        }

    }
}