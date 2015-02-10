using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shootem.SignalR
{
    public class GameHub : Microsoft.AspNet.SignalR.Hub
    {
        /// <summary>
        /// When player is online
        /// </summary>
        public void PlayerOnline()
        {
            Clients.All.setOnline();
        }
    }
}