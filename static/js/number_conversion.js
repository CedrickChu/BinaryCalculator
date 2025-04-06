document.addEventListener('DOMContentLoaded', function () {
    // Add loading animation to conversion buttons
    const conversionButtons = document.querySelectorAll('.conversion-button');
    conversionButtons.forEach(button => {
        button.addEventListener('click', function (e) {
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
                <div class="form-group">
                    <label for="input-number">Enter ${conversion.charAt(0).toUpperCase() + conversion.slice(1)} Number:</label>
                    <input type="text" id="input-number" class="form-control" placeholder="Enter number">
                </div><br>
                <div class="input-group">
                    <button id="perform-conversion" class="btn btn-primary">Convert</button>
                </div>
                <div class="result-container">
                    <h3>Results:</h3>
                    <div class="container mt-4">
                        <div class="row ">
                            <div class="col-12">
                                <label for="binary" class="form-label">Binary:</label>
                                <div class="input-group">
                                    <input type="text" id="binary-result" class="form-control" readonly aria-label="Binary result">
                                    <span class="input-group-text">2</span>
                                </div>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="col-12">
                                <label for="decimal" class="form-label">Decimal:</label>
                                <div class="input-group">
                                    <input type="text" id="decimal-result" class="form-control" readonly aria-label="Decimal result">
                                    <span class="input-group-text">10</span>
                                </div>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="col-12">
                                <label for="hex" class="form-label">Hexa:</label>
                                <div class="input-group">
                                    <input type="text" id="hex-result" class="form-control" readonly aria-label="Hexadecimal result">
                                    <span class="input-group-text">16</span>
                                </div>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="col-12">
                                <label for="octal" class="form-label">Octal:</label>
                                <div class="input-group">
                                    <input type="text" id="octal-result" class="form-control" readonly aria-label="Octal result">
                                    <span class="input-group-text">8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                
            `;

            menuContainer.appendChild(inputContainer);

            // Add conversion event listener
            const performConversionButton = document.getElementById('perform-conversion');
            performConversionButton.addEventListener('click', function () {
                const inputNumber = document.getElementById('input-number').value.trim();

                let decimalValue;
                switch (conversion) {
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
                document.getElementById('binary-result').value = convertToNibbleFormat(decimalToSignedBinary(decimalValue));
                document.getElementById('decimal-result').value = decimalValue;
                document.getElementById('hex-result').value = decimalToHex(decimalValue);
                document.getElementById('octal-result').value = decimalToOctal(decimalValue);
            });
        });
    });

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

    function decimalToOctal(decimal) {
        const intPart = Math.floor(decimal);
        const fracPart = decimal - intPart;

        let octalInt = intPart.toString(8);
        let octalFrac = '';

        // Convert fractional part
        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 6; // Limit fractional precision
            while (precision-- > 0 && tempFrac > 0) {
                tempFrac *= 8;
                const digit = Math.floor(tempFrac);
                octalFrac += digit.toString(8);
                tempFrac -= digit;
            }
        }

        return octalFrac ? `${octalInt}.${octalFrac}` : octalInt;
    }

    function decimalToHex(decimal) {
        const intPart = Math.floor(decimal);
        const fracPart = decimal - intPart;

        let hexInt = intPart.toString(16).toUpperCase();
        let hexFrac = '';

        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 6;
            while (precision-- > 0 && tempFrac > 0) {
                tempFrac *= 16;
                const digit = Math.floor(tempFrac);
                hexFrac += digit.toString(16).toUpperCase();
                tempFrac -= digit;
            }
        }

        return hexFrac ? `${hexInt}.${hexFrac}` : hexInt;
    }

    function decimalToSignedBinary(decimal, totalBits = 12, fracBits = 4) {
        const isNegative = decimal < 0;
        const absDecimal = Math.abs(decimal);

        const fixedPointValue = Math.round(absDecimal * Math.pow(2, fracBits));
        let binary = fixedPointValue.toString(2).padStart(totalBits, '0');

        if (isNegative) {
            binary = twosComplement(binary);
        }

        // Insert binary point
        const intPart = binary.slice(0, totalBits - fracBits);
        const fracPart = binary.slice(totalBits - fracBits);

        return intPart + '.' + fracPart;
    }

    function twosComplement(binaryStr) {
        const paddedBinaryStr = binaryStr.padStart(binaryStr.length, '0');

        const invertedBits = paddedBinaryStr.split('').map(bit => bit === '0' ? '1' : '0').join('');

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

    function convertToNibbleFormat(binaryStr) {
        // Remove any existing decimal point
        const [intPart, fracPart] = binaryStr.split('.');

        // Ensure integer part is padded from the left
        const paddedIntPart = intPart.padStart(Math.ceil(intPart.length / 4) * 4, '0');

        // Split integer part into proper 4-bit nibbles
        const intNibbles = [];
        for (let i = 0; i < paddedIntPart.length; i += 4) {
            intNibbles.push(paddedIntPart.slice(i, i + 4));
        }

        // Split fractional part into nibbles
        const fracNibbles = [];
        if (fracPart) {
            for (let i = 0; i < fracPart.length; i += 4) {
                fracNibbles.push(fracPart.slice(i, i + 4).padEnd(4, '0'));
            }
        }

        // Combine nibbles with space separator
        const formattedInt = intNibbles.join(' ');
        const formattedFrac = fracNibbles.length > 0 ? ' . ' + fracNibbles.join(' ') : '';

        return formattedInt + formattedFrac;
    }

    // 2's Complement functionality (signed)
    performComplementButton.addEventListener('click', function () {
        const binaryNumber = binaryInputComplement.value.trim();

        if (!isValidSignedBinaryInput(binaryNumber)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const decimalValue = signedBinaryToDecimal(binaryNumber);
        const result = twosComplement(binaryNumber);

        // Display results
        document.getElementById('complement-operation').textContent = `2's complement of ${decimalValue} = ${result.decimal}`;
        binaryComplementResult.value = result.binary;
        octalComplementResult.value = result.octal;
        decimalComplementResult.value = result.decimal;
        hexComplementResult.value = result.hex;
    });

    // Add event listeners to validate input
    document.addEventListener('DOMContentLoaded', function () {
        const inputField = document.getElementById('input-number');
        const targetSystemSelect = document.getElementById('target-system');

        targetSystemSelect.addEventListener('change', function () {
            const selectedSystem = this.value;
            const inputValue = inputField.value.trim();

            let isValid = true;
            switch (selectedSystem) {
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
