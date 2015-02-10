using Raven.Client;
using Raven.Client.Embedded;
namespace Database
{
    public static class DbStore
    {
        /// <summary>
        /// Documentstore, use this to open ravendb session
        /// </summary>
        public static IDocumentStore DocumentStore { get; private set; }

        /// <summary>
        /// Init documentstore so we can connect to ravendb
        /// </summary>
        public static void Initialize()
        {
            if (DocumentStore != null) return;

            DocumentStore = new EmbeddableDocumentStore
            {
                DataDirectory = "F:/Raven/Shootem",
                DefaultDatabase = "Shootem"
            }.Initialize();
        }
    }
}