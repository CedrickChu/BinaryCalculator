document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to conversion buttons
    const conversionButtons = document.querySelectorAll('.conversion-button');
    conversionButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const conversion = this.dataset.conversion;
        this.style.opacity = '0.7';
        this.textContent = 'Loading...';
        
        // Hide all conversion buttons
        const allButtons = document.querySelectorAll('.conversion-button');
        allButtons.forEach(btn => btn.style.display = 'none');
        
        // Create conversion input container dynamically
        const menuContainer = document.querySelector('.menu-container');
        const existingInputContainer = document.querySelector('.conversion-input-container');
        if (existingInputContainer) {
          existingInputContainer.remove();
        }
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'conversion-input-container';
        inputContainer.innerHTML = `
          <div class="input-group">
            <label for="input-number">Enter ${conversion.charAt(0).toUpperCase() + conversion.slice(1)} Number:</label>
            <input type="text" id="input-number" class="number-input" placeholder="Enter number">
          </div>
          <div class="input-group">
            <button id="perform-conversion" class="menu-button">Convert</button>
          </div>
          <div class="result-container">
            <h3>Results:</h3>
            <div class="result-row">
              <label>Decimal:</label>
              <span id="decimal-result"></span>
            </div>
            <div class="result-row">
              <label>Hexa:</label>
              <span id="hex-result"></span>
            </div>
            <div class="result-row">
              <label>Octal:</label>
              <span id="octal-result"></span>
            </div>
          </div>
        `;
        
        menuContainer.appendChild(inputContainer);
        
        // Add conversion event listener
        const performConversionButton = document.getElementById('perform-conversion');
        performConversionButton.addEventListener('click', function() {
          const inputNumber = document.getElementById('input-number').value.trim();
          
          let decimalValue;
          switch(conversion) {
            case 'binary':
              if (!isValidBinaryInput(inputNumber)) {
                alert('Invalid binary input. Only 0s and 1s allowed.');
                return;
              }
              decimalValue = binaryToDecimal16Bit(inputNumber);
              break;
            case 'decimal':
              decimalValue = parseFloat(inputNumber);
              break;
            case 'octal':
              if (!isValidOctalInput(inputNumber)) {
                alert('Invalid octal input. Only digits 0-7 allowed.');
                return;
              }
              decimalValue = parseInt(inputNumber, 8);
              break;
            case 'hexa':
              if (!isValidHexInput(inputNumber)) {
                alert('Invalid hexadecimal input. Only digits 0-9 and A-F allowed.');
                return;
              }
              decimalValue = parseInt(inputNumber, 16);
              break;
          }
          
          // Display results
          document.getElementById('decimal-result').textContent = decimalValue;
          document.getElementById('hex-result').textContent = decimalToHex16Bit(Math.abs(decimalValue));
          document.getElementById('octal-result').textContent = decimalToOctal16Bit(Math.abs(decimalValue));
        });
      });
    });
    
    // Conversion helper functions
    function convertFromBinary(input, targetSystem) {
      const isNegative = input.startsWith('-');
      const absInput = isNegative ? input.slice(1) : input;
      
      const decimalValue = binaryToDecimal16Bit(absInput);
      const convertedValue = convertDecimalToSystem(decimalValue, targetSystem);
      
      return isNegative ? `-${convertedValue}` : convertedValue;
    }
    
    function convertFromDecimal(input, targetSystem) {
      const decimalValue = parseFloat(input);
      return convertDecimalToSystem(decimalValue, targetSystem);
    }
    
    function convertFromOctal(input, targetSystem) {
      const isNegative = input.startsWith('-');
      const absInput = isNegative ? input.slice(1) : input;
      
      const decimalValue = parseInt(absInput, 8);
      const convertedValue = convertDecimalToSystem(decimalValue, targetSystem);
      
      return isNegative ? `-${convertedValue}` : convertedValue;
    }
    
    function convertFromHex(input, targetSystem) {
      const isNegative = input.startsWith('-');
      const absInput = isNegative ? input.slice(1) : input;
      
      const decimalValue = parseInt(absInput, 16);
      const convertedValue = convertDecimalToSystem(decimalValue, targetSystem);
      
      return isNegative ? `-${convertedValue}` : convertedValue;
    }
    
    function convertDecimalToSystem(decimal, targetSystem) {
      const isNegative = decimal < 0;
      const absDecimal = Math.abs(decimal);
      
      let result;
      switch(targetSystem) {
        case 'binary':
          result = decimalToBinary16Bit(absDecimal);
          break;
        case 'decimal':
          result = decimal.toString();
          break;
        case 'octal':
          result = decimalToOctal16Bit(absDecimal);
          break;
        case 'hex':
          result = decimalToHex16Bit(absDecimal);
          break;
      }
      
      return isNegative ? `-${result}` : result;
    }
    
    function binaryToDecimal16Bit(binary) {
      const [intPart, fracPart] = binary.split('.');
      let decimalValue = 0;
  
      // Convert integer part (signed)
      const signBit = intPart[0];
      const absIntPart = signBit === '1' ? twosComplement(intPart) : intPart;
      for (let i = 0; i < absIntPart.length; i++) {
        decimalValue += parseInt(absIntPart[absIntPart.length - 1 - i]) * Math.pow(2, i);
      }
      if (signBit === '1') decimalValue = -decimalValue;
  
      // Convert fractional part
      if (fracPart) {
        for (let i = 0; i < fracPart.length; i++) {
          decimalValue += parseInt(fracPart[i]) * Math.pow(2, -(i + 1));
        }
      }
  
      return decimalValue;
    }
    
    function decimalToOctal16Bit(decimal) {
      const intPart = Math.floor(decimal);
      const fracPart = decimal - intPart;
  
      let octalInt = intPart.toString(8).padStart(3, '0');
      let octalFrac = '';
  
      // Convert fractional part
      if (fracPart > 0) {
        let tempFrac = fracPart;
        let precision = 3; // Limit to 3 fractional digits for 8-bit representation
        while (precision-- > 0 && tempFrac > 0) {
          tempFrac *= 8;
          const digit = Math.floor(tempFrac);
          octalFrac += digit.toString(8);
          tempFrac -= digit;
        }
      }
  
      return octalFrac ? `${octalInt}.${octalFrac}` : octalInt;
    }
    
    function decimalToHex16Bit(decimal) {
      const intPart = Math.floor(decimal);
      const fracPart = decimal - intPart;
  
      let hexInt = intPart.toString(16).toUpperCase().padStart(2, '0');
      let hexFrac = '';
  
      // Convert fractional part
      if (fracPart > 0) {
        let tempFrac = fracPart;
        let precision = 2; // Limit to 2 fractional digits for 8-bit representation
        while (precision-- > 0 && tempFrac > 0) {
          tempFrac *= 16;
          const digit = Math.floor(tempFrac);
          hexFrac += digit.toString(16).toUpperCase();
          tempFrac -= digit;
        }
      }
  
      return hexFrac ? `${hexInt}.${hexFrac}` : hexInt;
    }
    
    function decimalToBinary16Bit(decimal) {
      const isNegative = decimal < 0;
      const absDecimal = Math.abs(decimal);
  
      const intPart = Math.floor(absDecimal);
      const fracPart = absDecimal - intPart;
  
      // Convert integer part (signed)
      let binaryInt = intPart.toString(2);
      if (isNegative) {
        binaryInt = twosComplement(binaryInt);
      }
  
      // Convert fractional part
      let binaryFrac = '';
      if (fracPart > 0) {
        let tempFrac = fracPart;
        let precision = 32; // Allow more precision for fractional part
        while (precision-- > 0 && tempFrac > 0) {
          tempFrac *= 2;
          const digit = Math.floor(tempFrac);
          binaryFrac += digit;
          tempFrac -= digit;
        }
      }
  
      return binaryFrac ? `${binaryInt}.${binaryFrac}` : binaryInt;
    }
  
    function twosComplement(binaryStr) {
      // Ensure the input binary string is padded with leading zeros to maintain its original length
      const paddedBinaryStr = binaryStr.padStart(binaryStr.length, '0');
      
      // Invert bits
      const invertedBits = paddedBinaryStr.split('').map(bit => bit === '0' ? '1' : '0').join('');
      
      // Add 1 to inverted bits
      let result = '';
      let carry = 1;
      for (let i = invertedBits.length - 1; i >= 0; i--) {
        const sum = parseInt(invertedBits[i]) + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
      }
      
      // Ensure the result has the same length as the input
      while (result.length < paddedBinaryStr.length) {
        result = '0' + result;
      }
      
      return result;
    }
  
    // Subtraction functionality
    function performSubtraction(input1, input2, targetSystem) {
      const decimal1 = binaryToDecimal16Bit(input1);
      const decimal2 = binaryToDecimal16Bit(input2);
      
      const resultDecimal = decimal1 - decimal2;
      
      let result;
      switch(targetSystem) {
        case 'binary':
          result = decimalToBinary16Bit(resultDecimal);
          break;
        case 'decimal':
          result = resultDecimal.toString();
          break;
        case 'octal':
          result = decimalToOctal16Bit(Math.abs(resultDecimal));
          break;
        case 'hex':
          result = decimalToHex16Bit(Math.abs(resultDecimal));
          break;
      }
      
      return result;
    }
  
    // Input validation function
    function isValidBinaryInput(input) {
      return /^[01]+(\.[01]+)?$/.test(input);
    }
  
    function isValidHexInput(input) {
      return /^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$/.test(input);
    }
  
    function isValidOctalInput(input) {
      return /^[0-7]+(\.[0-7]+)?$/.test(input);
    }
  
    // Add event listeners to validate input
    document.addEventListener('DOMContentLoaded', function() {
      const inputField = document.getElementById('input-number');
      const targetSystemSelect = document.getElementById('target-system');
  
      targetSystemSelect.addEventListener('change', function() {
        const selectedSystem = this.value;
        const inputValue = inputField.value.trim();
  
        let isValid = true;
        switch(selectedSystem) {
          case 'binary':
            isValid = isValidBinaryInput(inputValue);
            break;
          case 'hex':
            isValid = isValidHexInput(inputValue);
            break;
          case 'octal':
            isValid = isValidOctalInput(inputValue);
            break;
        }
  
        if (!isValid) {
          alert(`Invalid input for ${selectedSystem.toUpperCase()} number system`);
          inputField.value = '';
        }
      });
    });
  });
  