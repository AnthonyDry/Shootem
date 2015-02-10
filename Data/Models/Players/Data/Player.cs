using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Models.Players.Data
{
    public static partial class Players
    {
        public class Player
        {
            public string ConnectionId { get; set; }

            public string Name { get; set; }
            
        }
    }
}