using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Data.Models
{
    public interface IId { }

    public struct Id<T> : IId
    {
        private readonly Guid _value;

        public Id(Guid value)
        {
            _value = value;
        }

        public static implicit operator Guid(Id<T> id)
        {
            return id._value;
        }

        public static explicit operator Id<T>(Guid value)
        {
            return new Id<T>(value);
        }
    }
}