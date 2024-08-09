// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateListing {
    struct Location {
        string useraddress;
        string city;
        string state;
        string zip;
        int256 latitude;
        int256 longitude;
    }

    struct Details {
        string propertyType;
        uint256 bedrooms;
        uint256 bathrooms;
        uint256 squareFootage;
        uint256 lotSize;
        string description;
    }

    struct Seller {
        string name;
        string email;
        string phone;
    }

    struct Pricing {
        uint256 price;
        uint256 securityDeposit;
        uint256 rentalPrice;
    }

    struct Property {
        string userId;
        Location location;
        Details details;
        Seller seller;
        Pricing pricing;
        string listingType;
        address payable owner;
        bool isActive;
    }

    struct PropertyInput {
        string userId;
        Location location;
        Details details;
        Seller seller;
        Pricing pricing;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;

    event PropertyListed(uint256 indexed propertyId, string indexed userId, address indexed owner);
    event PropertySold(uint256 indexed propertyId, address indexed oldOwner, address indexed newOwner);
    event PropertyUpdated(uint256 indexed propertyId);
    event PropertyRemoved(uint256 indexed propertyId);

    function listProperty(PropertyInput memory input, string memory listingType) public {
        propertyCount++;
        properties[propertyCount] = Property({
            userId: input.userId,
            location: input.location,
            details: input.details,
            seller: input.seller,
            pricing: input.pricing,
            listingType: listingType,
            owner: payable(msg.sender),
            isActive: true
        });

        emit PropertyListed(propertyCount, input.userId, msg.sender);
    }

    function buyProperty(uint256 _propertyId) public payable {
        Property storage property = properties[_propertyId];
        require(property.isActive, "Property is not active");
        require(msg.value >= property.pricing.price, "Insufficient funds");
        require(msg.sender != property.owner, "Owner cannot buy their own property");

        address payable oldOwner = property.owner;
        property.owner = payable(msg.sender);
        property.isActive = false;

        oldOwner.transfer(property.pricing.price);
        
        if (msg.value > property.pricing.price) {
            payable(msg.sender).transfer(msg.value - property.pricing.price);
        }

        emit PropertySold(_propertyId, oldOwner, msg.sender);
    }

    function updateProperty(
        uint256 _propertyId,
        uint256 _newPrice,
        string memory _newDescription
    ) public {
        Property storage property = properties[_propertyId];
        require(msg.sender == property.owner, "Only the owner can update the property");
        require(property.isActive, "Property is not active");

        property.pricing.price = _newPrice;
        property.details.description = _newDescription;

        emit PropertyUpdated(_propertyId);
    }

    function removeProperty(uint256 _propertyId) public {
        Property storage property = properties[_propertyId];
        require(msg.sender == property.owner, "Only the owner can remove the property");
        require(property.isActive, "Property is not active");

        property.isActive = false;

        emit PropertyRemoved(_propertyId);
    }

    function getProperty(uint256 _propertyId) public view returns (Property memory) {
        return properties[_propertyId];
    }
}


// yellow-black theme

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
    
    --card: 0 0% 100%;
    --card-foreground: 0 0% 0%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 0%;
    
    --primary: 60 100% 50%;
    --primary-foreground: 0 0% 0%;
    
    --secondary: 60 100% 96%;
    --secondary-foreground: 0 0% 0%;
    
    --muted: 60 100% 96%;
    --muted-foreground: 0 0% 45%;
    
    --accent: 60 100% 50%;
    --accent-foreground: 0 0% 0%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 0%;
    
    --border: 0 0% 80%;
    --input: 0 0% 80%;
    --ring: 60 100% 50%;
    
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 0 0% 0%;
    --foreground: 60 100% 50%;
    
    --card: 0 0% 5%;
    --card-foreground: 60 100% 50%;
    
    --popover: 0 0% 0%;
    --popover-foreground: 60 100% 50%;
    
    --primary: 60 100% 50%;
    --primary-foreground: 0 0% 0%;
    
    --secondary: 0 0% 15%;
    --secondary-foreground: 60 100% 50%;
    
    --muted: 0 0% 15%;
    --muted-foreground: 60 100% 80%;
    
    --accent: 60 100% 50%;
    --accent-foreground: 0 0% 0%;
    
    --destructive: 0 72.2% 50.6%;
    --destructive-foreground: 60 100% 50%;
    
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 60 100% 50%;
  }
}

.shadow-light {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.085);
}

.shadow-dark {
  box-shadow: inset 0 0 5px rgba(255, 255, 0, 0.141);
}
