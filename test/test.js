"use strict";

var assert = require("assert");
var fs = require('fs');

var username = "daniel.hritzkiv@gmail.com";
var password = "h35-ptt-qV7-G4R";

var AvaTax = require("../");//avatax;
var avatax = new AvaTax(username, password, {
	development: true
});

var maxTimeout = 1e4;//10 seconds
var slowTime = 1e3;//1 second

var address = {
	AddressCode: "destination",
	Line1: "118 N Clark St",
	Line2: "Suite 100",
	Line3: "ATTN Accounts Payable",
	City: "Chicago",
	Region: "IL",
	PostalCode: "60602",
	Country: "US"
};

var address2 = {
	AddressCode: "origin",
	Line1: "151 Sterling Rd.",
	Line2: "Studio 2",
	City: "Toronto",
	Region: "Ontario",
	Country: "Canada",
	PostalCode: "M6R 2B2"
};

var address3 = {
	AddressCode: "destination",
	Line1: "1 Infinite Loop",
	Line2: "ATTN Tim Cook",
	City: "Cupertino",
	Region: "CA",
	PostalCode: "95014",
	Country: "US"
};

var address4 = {
	AddressCode: "destination",
	Line1: "1 Churchill Place",
	Line2: "Barclays Bank PLC",
	City: "London",
	//Region: "London",
	PostalCode: "E145HP",
	Country: "UK"
};

function newGetTaxObject() {
	var object = {
		CustomerCode: "101",
		DocDate: new Date("2014-05-13T05:05:30.036Z"),
		//CompanyCode: fields.CompanyCode,
		Commit: false,
		CurrencyCode: "CAD",
		//CustomerUsageType: fields.CustomerUsageType,
		//Discount: fields.Discount,
		//DocCode: fields.DocCode,
		PurchaseOrderNo: "ABC99",
		//ExemptionNo: fields.ExemptionNo,
		//DetailLevel: fields.DetailLevel,
		DocType: "SalesOrder",
		Lines: [
			{
				LineNo: "1",
				DestinationCode : "destination",
				OriginCode: "origin",
				ItemCode: "MFS1V1",
				Qty: 2,
				Amount: 1158.99,
				Discounted: false
			}
		],
		Addresses: [address3, address2],
		Client: "node-avatax",
	};
	return object;
}

var coordinates = [47.627935,-122.51702];

describe('AvaTax', function() {

	describe("New AvaTax instance", function() {
		it('should throw an error when username and/or passwords are missing', function() {
			assert.throws(function() {
				new AvaTax();
			}, Error);

			assert.throws(function() {
				new AvaTax({
					development: false,
				});
			}, Error);

			assert.throws(function() {
				new AvaTax("username");
			}, Error);

			assert.throws(function() {
				new AvaTax("username", {
					development: true
				});
			}, Error);
		});
	});

	describe('#validateAddress()', function() {
		this.timeout(maxTimeout);
		this.slow(slowTime);

		it('should return a json response', function(done) {
			avatax.validateAddress(address3, function(err, address) {
				console.log(err, address);
				assert.equal(err, null);
				assert.equal(true, !!address);
				//assert.equal(true, !!address.line1);
				done();
			});
		});

		//currently can't find these addresses and need to figure out error handling;
		/*it('should return a json response when only providing street and postal code', function(done) {
			avatax.validateAddress({
				street1: address.street1,
				street2: address.street2,
				postalCode: address.postalCode
			}, function(err, address) {
				console.log(err, address);
				assert.equal(err, null);
				assert.equal(true, !!address);
				//assert.equal(true, !!address.line1);
				done();
			});
		});

		it('should return a json response when only providing street, city, province', function(done) {
			avatax.validateAddress({
				street1: address.street1,
				street2: address.street2,
				city: address.city,
				province: address.province
			}, function(err, address) {
				console.log(err, address);
				assert.equal(err, null);
				assert.equal(true, !!address);
				//assert.equal(true, !!address.line1);
				done();
			});
		});*/

	});

	describe('#estimateTax()', function() {
		this.timeout(maxTimeout);
		this.slow(slowTime);

		it('should return a number', function(done) {
			avatax.estimateTax(coordinates, 310.12, function(err, estimate) {
				console.log(err, estimate);
				assert.equal(err, null);
				assert.equal(true, typeof estimate == "number");
				//assert.equal(true, !!address.line1);
				done();
			});
		});
	});

	describe('#estimateTaxDetails()', function() {
		this.timeout(maxTimeout);
		this.slow(slowTime);

		it('should return an array', function(done) {
			avatax.estimateTaxDetails(coordinates, 310.12, function(err, estimateDetails) {
				console.log(err, estimateDetails);
				assert.equal(err, null);
				assert.equal(true, Array.isArray(estimateDetails));
				//assert.equal(true, !!address.line1);
				done();
			});
		});
	});

	describe('#getTax()', function() {
		this.timeout(maxTimeout);
		this.slow(slowTime);

		it('should return an object', function(done) {
			var getTaxObject = newGetTaxObject();
			avatax.getTax(getTaxObject, function(err, returnDoc) {
				console.log(err, returnDoc);
				assert.equal(err, null);
				assert.equal(true, !!returnDoc);
				//assert.equal(true, !!address.line1);
				done();
			});
		});

		it('should throw an error', function(done) {
			var getTaxObject = newGetTaxObject();
			getTaxObject.Addresses = [];//remove address, causing a requirements error;
			avatax.getTax(getTaxObject, function(err, returnDoc) {
				console.log(err, returnDoc);
				assert.equal(true, !!err);
				assert.equal(undefined, returnDoc);
				//assert.equal(true, !!address.line1);
				done();
			});
		});
	});

});
