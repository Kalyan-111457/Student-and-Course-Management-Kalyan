using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UseCaseFinalSubmission.Models
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        [JsonIgnore]

        public string Role { get; set; } = "Admin";
    }
}
