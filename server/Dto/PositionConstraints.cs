using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Dto
{
    public static class PositionConstraints
    {
        public const int TitleMaxLength = 255;
        public const string TitleMaxLengthErrorMessage = "Position title must be 255 characters or fewer.";
        public const string TitleRequiredErrorMessage = "Position title is required.";
        public const string AttributeIdRequiredErrorMessage = "Attribute ID is required.";
        public const string OrderRequiredErrorMessage = "Order is required.";
        public const string ExpectedValueRequiredErrorMessage = "Expected value is required.";
        public const int ShortDescriptionMaxLength = 500;
        public const string ShortDescriptionMaxLengthErrorMessage = "Short description must be 500 characters or fewer.";
        public const int MaxProjectsMin = 0;
        public const int MaxProjectsMax = 100;
        public const string MaxProjectsRangeErrorMessage = "Max projects must be between 0 and 100.";
        public const string TagIdRequiredErrorMessage = "Tag ID is required.";

    }
}