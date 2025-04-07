// document.getElementById('perform-division').addEventListener('click', function() {
//     let dividend = document.getElementById('binary-input-dividend').value;
//     let divisor = document.getElementById('binary-input-divisor').value;

//     // Determine if dividend and divisor are signed
//     let dividendSign = dividend[0] === '1' ? -1 : 1;
//     let divisorSign = divisor[0] === '1' ? -1 : 1;

//     // Convert to two's complement if negative
//     if (dividendSign === -1) {
//         dividend = twoComplement(dividend);
//     }
//     if (divisorSign === -1) {
//         divisor = twoComplement(divisor);
//     }

//     // Initialize the step-by-step table
//     let stepDetails = document.getElementById('step-details');
//     stepDetails.innerHTML = ''; // Clear previous steps

//     let quotient = '';
//     let remainder = '';
//     let stepNumber = 1;

//     document.getElementById('current-dividend').textContent = dividend;
//     document.getElementById('current-divisor').textContent = divisor;

//     // Step 1: Initial step before division begins
//     let firstStep = document.createElement('tr');
//     firstStep.innerHTML = `
//         <td>${stepNumber}</td>
//         <td>${remainder}</td>
//         <td>${quotient}</td>
//         <td>Start division</td>
//     `;
//     stepDetails.appendChild(firstStep);
//     stepNumber++;

//     // Perform the long division process
//     for (let i = 0; i < dividend.length; i++) {
//         // Add the current bit of the dividend to the remainder
//         remainder += dividend[i];

//         // Step 2: Display current remainder after adding bit
//         let step = document.createElement('tr');
//         step.innerHTML = `
//             <td>${stepNumber}</td>
//             <td>${remainder}</td>
//             <td>${quotient}</td>
//             <td>Added bit ${dividend[i]}</td>
//         `;
//         stepDetails.appendChild(step);
//         stepNumber++;

//         // If the remainder is greater than or equal to the divisor, perform binary subtraction (XOR)
//         if (parseInt(remainder, 2) >= parseInt(divisor, 2)) {
//             // Subtract (XOR operation in binary)
//             remainder = (parseInt(remainder, 2) ^ parseInt(divisor, 2)).toString(2).padStart(remainder.length, '0');
//             quotient += '1';

//             // Step 3: Perform subtraction
//             let subtractionStep = document.createElement('tr');
//             subtractionStep.innerHTML = `
//                 <td>${stepNumber}</td>
//                 <td>${remainder}</td>
//                 <td>${quotient}</td>
//                 <td>Subtracted divisor</td>
//             `;
//             stepDetails.appendChild(subtractionStep);
//             stepNumber++;
//         } else {
//             quotient += '0';

//             // Step 4: No subtraction, just append 0 to the quotient
//             let noSubtractionStep = document.createElement('tr');
//             noSubtractionStep.innerHTML = `
//                 <td>${stepNumber}</td>
//                 <td>${remainder}</td>
//                 <td>${quotient}</td>
//                 <td>No subtraction, added 0 to quotient</td>
//             `;
//             stepDetails.appendChild(noSubtractionStep);
//             stepNumber++;
//         }
//     }

//     // Apply the sign to the final quotient and remainder
//     quotient = applySign(quotient, dividendSign * divisorSign);
//     remainder = applySign(remainder, dividendSign);

//     // Final result step
//     let finalStep = document.createElement('tr');
//     finalStep.innerHTML = `
//         <td>${stepNumber}</td>
//         <td>${remainder}</td>
//         <td>${quotient}</td>
//         <td>Final result</td>
//     `;
//     stepDetails.appendChild(finalStep);

//     // Show final quotient and remainder
//     document.getElementById('binary-division-result2').value = quotient;
//     document.getElementById('binary-remainder').value = remainder;

//     // Convert and display the results in Octal, Decimal, and Hexadecimal
//     let decimalResult = parseInt(quotient, 2);
//     document.getElementById('decimal-division-result').value = decimalResult;
//     document.getElementById('octal-division-result').value = decimalResult.toString(8);
//     document.getElementById('hex-division-result').value = decimalResult.toString(16).toUpperCase();
// });

// // Function to calculate the two's complement of a binary number
// function twoComplement(binary) {
//     let inverted = '';
//     for (let i = 0; i < binary.length; i++) {
//         inverted += (binary[i] === '0') ? '1' : '0';
//     }
//     return (parseInt(inverted, 2) + 1).toString(2).padStart(binary.length, '0');
// }

// // Function to apply sign to the binary result
// function applySign(binary, sign) {
//     if (sign === -1) {
//         // Apply two's complement if the result is negative
//         return twoComplement(binary);
//     }
//     return binary;
// }
