using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Models
{
    public static partial class Lobbies
    {
        public class Lobby
        {
            public Id<Lobby> Id { get; set; }


            public string Name { get; set; }

        }
    }
}