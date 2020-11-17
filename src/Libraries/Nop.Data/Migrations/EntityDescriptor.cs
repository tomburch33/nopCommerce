using System.Collections.Generic;

namespace Nop.Data.Migrations
{
    public class EntityDescriptor
    {
        public EntityDescriptor()
        {
            Fields = new List<EntityFieldDescriptor>();
        }
        public string EntityName { get; set; }
        public ICollection<EntityFieldDescriptor> Fields { get; set; }
    }
}