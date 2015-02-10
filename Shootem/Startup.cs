using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Shootem.Startup))]
namespace Shootem
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
