using Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Models
{
    public class ApplicationData
    {
        /// <summary>
        /// Init the application
        /// </summary>
        public static void InitializeApplication()
        {
            StartDatabase();
        }

        /// <summary>
        /// Kickstart the database
        /// </summary>
        private static void StartDatabase()
        {
            DbStore.Initialize();
        }
    }
}