using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using UseCaseFinalSubmission.Validations;

namespace UseCaseFinalSubmission.Models
{
    [StudentValidation]
    public class Student
    {

        [Key]
        public int StudentId { get; set; }

        public string FullName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string Password { get; set; }



        [Phone]
        public string Phone { get; set; }

        public string Address { get; set; }


        public string Role { get; set; }


        public DateTime datetime { get; set; } = DateTime.Now;

         

        [JsonIgnore]
        public ICollection<Enrollement> Enrollements { get; set; } = new List<Enrollement>();


    }
}
