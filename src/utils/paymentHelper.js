const crypto = require('crypto');

class PaymentHelper {
	constructor() {
		this.encryptionKey = process.env.PAYMENT_ENCRYPTION_KEY;
		this.algorithm = 'aes-256-gcm';
	}

	// Encrypt payment information
	encryptPaymentInfo(paymentInfo) {
		try {
			const iv = crypto.randomBytes(16);
			const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), iv);

			let encrypted = cipher.update(JSON.stringify(paymentInfo), 'utf8', 'hex');
			encrypted += cipher.final('hex');

			const authTag = cipher.getAuthTag();

			return {
				encrypted,
				iv: iv.toString('hex'),
				authTag: authTag.toString('hex'),
			};
		} catch (error) {
			throw new Error('Erreur lors du chiffrement des informations de paiement');
		}
	}

	// Decrypt payment information
	decryptPaymentInfo(encryptedData) {
		try {
			const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), Buffer.from(encryptedData.iv, 'hex'));

			decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

			let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
			decrypted += decipher.final('utf8');

			return JSON.parse(decrypted);
		} catch (error) {
			throw new Error('Erreur lors du déchiffrement des informations de paiement');
		}
	}

	// Validate payment information format
	validatePaymentInfo(paymentInfo) {
		const required = ['cardNumber', 'expiryDate', 'cvv'];
		for (const field of required) {
			if (!paymentInfo[field]) {
				throw new Error(`Champ requis manquant: ${field}`);
			}
		}

		// Validate card number format (simplified)
		if (!/^\d{16}$/.test(paymentInfo.cardNumber)) {
			throw new Error('Format de numéro de carte invalide');
		}

		// Validate expiry date format (MM/YY)
		if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentInfo.expiryDate)) {
			throw new Error("Format de date d'expiration invalide");
		}

		// Validate CVV format
		if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
			throw new Error('Format de CVV invalide');
		}

		return true;
	}

	// Mask sensitive payment information for display
	maskPaymentInfo(paymentInfo) {
		return {
			...paymentInfo,
			cardNumber: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`,
			cvv: '***',
		};
	}
}

module.exports = new PaymentHelper();
