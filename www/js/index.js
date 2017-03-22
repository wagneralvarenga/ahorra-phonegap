/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var pvbooStartup = true;
var pvbooGPSInitialized = false;
var pvintPage = 0;
var pvintPromoPage = 0;
var pvintImageIndex = 1;
var pvintImageCount = 0;
var pvintTutorialPage = 1;
var pvintPage = 0;
var pvintNivel = 0;
var pvintDistanciaMax = 2;
var pvdblLatitud = 6.2126324;
var pvdblLongitud = -75.5800677;
var pvstrVersion = "1.0";
var pvstrAccount = "";
var pvstrDeviceID = "";
var pvstrFunction = "";
var pvstrSearchData = "";
var pvstrPostMessage = "";
var pvstrBack = ["", "", "", "", ""];
var pvpreID = "";
var pvproNombre = "";
var pvproID = "";
var pvproEAN = "";
var pvproFoto = "";
var pvproFotoAlias = "";
var pvobjRequest = null;
var admobid = {
	interstitial: 'ca-app-pub-3819406531547363/4201960719'
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		pvstrAccount = GetStorage("AH_EMAIL", "");
		pvstrDeviceID = "" + device.uuid;
		pvintDistanciaMax = parseInt(GetStorage("AH_DISTANCIAMAX", "2"));
		TutorialPage();
		pvstrBack[0] = "" + document.getElementById("divContent").innerHTML;
		document.addEventListener("backbutton", Back, false);
		setTimeout(Initialize, 1000);
    }
};

window.onerror = function (err, fileName, lineNumber) {
	// alert or console.log a message
	MsgBox(fileName, 'Line:', lineNumber, 'Error:', e.message);
};

Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function getXmlHttpRequestObject() {
	try {
		if (window.XMLHttpRequest)
			return new XMLHttpRequest(); //Not IE
		else {
			if (window.ActiveXObject)
				return new ActiveXObject("Microsoft.XMLHTTP"); //IE
			else
				alert("Su explorador no soporta el m&eacute;todo XmlHttpRequest requerido.");
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " getXmlHttpRequestObject()");
	}
}

function AddProductToList(vlproID) {
	try {
		if ("" + document.getElementById("txtLista").value != "" || "" + document.getElementById("txtNuevaLista").value != "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=ADDPRODUCTTOLIST&PROID=" + vlproID + "&Lista=" + document.getElementById("txtLista").value + "&NuevaLista=" + window.btoa("" + document.getElementById("txtNuevaLista").value) + "&Cantidad=" + document.getElementById("txtCantidad").value + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = GetListsData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
		else
			MsgBox("El campo Lista o Nueva Lista es requerido.");
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (AddProductToList)");
	}
}

function AddToList(vlintProductID, vlstrProductName, vlstrProductPhoto, vlstrProductEAN, vlstrPhotoAlias, vlintPhotoCount) {
	var lcintPos = -1;
	var lcstrCredito = "";
	var lcstrUserPhoto = "";
	
	try {
		pvintImageIndex = 1;
		pvproID = vlintProductID;
		pvproNombre = vlstrProductName;
		pvproEAN = vlstrProductEAN;
		pvproFotoAlias = vlstrPhotoAlias;
		pvintImageCount = vlintPhotoCount;
		if (vlstrProductPhoto != "") {
			if (pvproFotoAlias != "")
				lcstrUserPhoto = "<br /><span id='lblAliasUsuario'>Usuario: " + pvproFotoAlias + "</span>";
			else
				lcstrUserPhoto = "<br /><span id='lblAliasUsuario'></span>";
			lcintPos = vlstrProductPhoto.indexOf("://");
			if (lcintPos >= 0) {
				lcstrCredito = vlstrProductPhoto.substr(lcintPos + 3);
				lcintPos = lcstrCredito.indexOf("/");
				if (lcintPos >= 0)
					lcstrCredito = lcstrCredito.substr(0, lcintPos);
				lcstrCredito = lcstrCredito.replace("www.", "").replace("WWW.", "");
				pvproFoto = "<p align='center'><img id='imgFoto' src='" + vlstrProductPhoto + "' style='height: 200px' onclick=\"document.getElementById('uploaded_file').click();\" /><br />" + vlstrProductEAN + "<br /><span id='lblFotoCredito'>Foto: " + lcstrCredito + "</span>" + lcstrUserPhoto + "</p>";
			}
			else
				pvproFoto = "<p align='center'><img id='imgFoto' src='" + vlstrProductPhoto + "' style='height: 200px' onclick=\"document.getElementById('uploaded_file').click();\" /><br />" + vlstrProductEAN + "</p>";
		}
		else
			pvproFoto = "<p align='center'><img id='imgFoto' src='img/noimage.jpg' style='cursor: pointer; height: 200px' onclick=\"document.getElementById('uploaded_file').click();\" /><br />" + vlstrProductEAN + "</p>";
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=ADDTOLIST&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = AddToListData;
			pvobjRequest.send(null);
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (AddToList)");
	}
}

function AddToListData(vlstrResponse) {
	var lcintI = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel = 2;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>" + pvproNombre + "</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div id='divFoto' class='ui-body ui-body-a'>";
					lcstrHtml += "<table style='width: 100%'>";
					lcstrHtml += "<tr>";
					lcstrHtml += "<td style='width: 10%; text-align: center; vertical-align: middle;'>";
					if (pvintImageCount > 1)
						lcstrHtml += "<i id='iPrev' class='fa fa-chevron-left fa-2x' style='cursor: pointer; visibility: hidden;' onclick='GetPreviousImage();'></i></td>";
					else
						lcstrHtml += "</td>";
					lcstrHtml += "<td id='tdFoto' style='width: 80%; text-align: center; vertical-align: middle;'>";
					if (pvproFoto != "")
						lcstrHtml += pvproFoto;
					lcstrHtml += "</td>";
					lcstrHtml += "<td style='width: 10%; text-align: center; vertical-align: middle;'>";
					if (pvintImageCount > 1)
						lcstrHtml += "<i id='iNext' class='fa fa-chevron-right fa-2x' style='cursor: pointer; visibility: visible;' onclick='GetNextImage();'></i></td>";
					else
						lcstrHtml += "</td>";
					lcstrHtml += "<tr>";
					lcstrHtml += "</table>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>Adicionar producto a lista de mercado</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<ul id='ulLista' data-role='listview' data-inset='true'>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtLista'>Adicionar a esta lista:</label>";
					lcstrHtml += "<select name='txtLista' id='txtLista'>";
					lcstrHtml += "<option value=''>-- SELECCIONE LISTA --</option>";
					for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++)
						lcstrHtml += "<option value='" + lcobjResponse.data[lcintI].lisid + "'>" + lcobjResponse.data[lcintI].lisnombre + "</option>";
					lcstrHtml += "</select>";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtNuevaLista'>Crear una nueva lista:</label>";
					lcstrHtml += "<input type='text' name='txtNuevaLista' id='txtNuevaLista' value='' data-clear-btn='true' placeholder='Nombre de la nueva lista de mercado' />";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtCantidad'>Cantidad:</label>";
					lcstrHtml += "<input type='number' data-type='range' name='txtCantidad' id='txtCantidad' value='1' min='1' max='50' step='1' data-highlight='true' />";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='AddProductToList(" + pvproID + ");'>Adicionar</button>";
					lcstrHtml += "</li>";
					lcstrHtml += "</ul>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					//lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
				$('#ulLista').listview().listview('refresh');
				$('#txtLista').selectmenu().selectmenu("refresh"); 
				$('[type="text"]').textinput().textinput('refresh');
				$('[type="button"]').button().button('refresh');
				$('[type="number"]').slider().slider('refresh');
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (AddToListData)");
	}
}

function Back() {
	try {
		if (pvintNivel > 0) {
			pvintNivel--;
			document.getElementById("divContent").innerHTML = pvstrBack[pvintNivel];
			if (document.getElementById("ulProductos"))
				$('#ulProductos').listview().listview('refresh');
			if (document.getElementById("ulContribuir"))
				$('#ulContribuir').listview().listview('refresh');
			if (document.getElementById("ulPrecios"))
				$('#ulPrecios').listview().listview('refresh');
			if (document.getElementById("txtUbicacion"))
				$('#txtUbicacion').selectmenu().selectmenu("refresh");
			$('[type="text"]').textinput().textinput('refresh');
			$('[type="button"]').button().button('refresh');
			if (pvintNivel == 0) {
				if (document.getElementById("tdTutText"))
					SetTutorialPage(pvintTutorialPage, 0);
				else {
					if (document.getElementById("ulBest50"))
						$('#ulBest50').listview().listview('refresh');
					$('[type="button"]').button().button('refresh');
				}
			}
			document.getElementById("txtBuscar").value = "";
		}
		else {
			if ("" + device.platform == "Android") {
				navigator.notification.confirm(
					"Salir de la aplicación",
					function (button) {
						if (button == 1)
							navigator.app.exitApp();
					},
					'Salir',
					'Ok, Cancelar'
				);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Back)");
	}
}

function ContributePrice(vlproID) {
	var lcstrError = "";
	var lcstrRequest = "";
	
	try {
		if ("" + document.getElementById("txtUbicacion").value == "" && "" + document.getElementById("txtNuevaUbicacion").value == "" && lcstrError == "")
			lcstrError = "El campo Ubicaci&oacute;n o Nueva Ubicaci&oacute;n es requerido.";
		if ("" + document.getElementById("txtPrecio").value == "" && lcstrError == "")
			lcstrError = "El campo Precio es requerido.";
		if (lcstrError == "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=CONTRIBUTE2&PROID=" + vlproID + "&Ubicacion=" + document.getElementById("txtUbicacion").value + "&NuevaUbicacion=" + window.btoa("" + document.getElementById("txtNuevaUbicacion").value) + "&Precio=" + document.getElementById("txtPrecio").value + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = GetPricesData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
				pvstrPostMessage = "¡Gracias! El precio ha sido ingresado satisfactoriamente.";
			}
		}
		else
			MsgBox(lcstrError);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ContributePrice)");
	}
}
			
function ContributeProduct() {
	var lcstrError = "";
	
	try {
		if ("" + document.getElementById("txtProducto").value == "" && lcstrError == "")
			lcstrError = "El campo Producto es requerido.";
		if ("" + document.getElementById("txtUbicacion").value == "" && "" + document.getElementById("txtNuevaUbicacion").value == "" && lcstrError == "")
			lcstrError = "El campo Ubicación o Nueva Ubicación es requerido.";
		if ("" + document.getElementById("txtPrecio").value == "" && lcstrError == "")
			lcstrError = "El campo Precio es requerido.";
		if (lcstrError == "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=CONTRIBUTE&EAN=" + document.getElementById("txtEAN").value + "&Producto=" + window.btoa("" + document.getElementById("txtProducto").value) + "&Ubicacion=" + document.getElementById("txtUbicacion").value + "&NuevaUbicacion=" + window.btoa("" + document.getElementById("txtNuevaUbicacion").value) + "&Precio=" + document.getElementById("txtPrecio").value + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = ContributeProductData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
		else
			MsgBox(lcstrError);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ContributeProduct)");
	}
}

function ContributeProductData() {
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					if (lcobjResponse.ean != "")
						GetScannedProduct(lcobjResponse.ean);
					else
						ShowMessage("¡ Gracias !", "La informaci&oacute;n que ingresaste ha sido enviada a nuestro equipo; la revisaremos y pronto la incluiremos para que est&eacute; disponible.");
				}
				else
					ShowMessage("Contribuir", lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ContributeProductData)");
	}
}

function DeleteFromList(vllisID, vlproID) {
	try {
		navigator.notification.confirm(
			"Eliminar producto de la lista?",
			function (button) {
				if (button == 1) {
					pvobjRequest = getXmlHttpRequestObject();
					if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
						lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=DELETEFROMLIST&LISID=" + vllisID + "&PROID=" + vlproID + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
						console.log(">> " + lcstrRequest);
						pvobjRequest.open("GET", lcstrRequest, true);
						pvobjRequest.onreadystatechange = GetListsData;
						pvobjRequest.send(null);
						document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
					}
				}
			},
			'Eliminar',
			'Ok, Cancelar'
		);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (DeleteFromList)");
	}
}

function GetBarCodeData() {
	var lcintI = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel = 1;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++) {
						lcstrHtml += "<div class='nd2-card card-media-right card-media-small'>";
						lcstrHtml += "<div class='card-media'>";
						if ("" + lcobjResponse.data[lcintI].profoto != "")
							lcstrHtml += "<img src='" + lcobjResponse.data[lcintI].profoto + "' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\" />";
						else
							lcstrHtml += "<img src='img/noimage.jpg' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\" />";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='card-title has-supporting-text'>";
						lcstrHtml += "<h5 class='card-subtitle'><b>" + lcobjResponse.data[lcintI].pronombre + "</b></h5>";
						lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].proean + "</h5>";
						if ("" + lcobjResponse.data[lcintI].sucnombre != "") {
							if ("" + lcobjResponse.data[lcintI].prevalorpromo != "0")
								lcstrHtml += "<h5 class='card-subtitle'><strike>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + "</strike>&nbsp;<font color='red'>$" + (lcobjResponse.data[lcintI].prevalorpromo).formatMoney(0, ',', '.') + "</font> (" + lcobjResponse.data[lcintI].usualias + ")</h5>";
							else
								lcstrHtml += "<h5 class='card-subtitle'>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + " (" + lcobjResponse.data[lcintI].usualias + ")</h5>";
							lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].prefecha + "<br />" + lcobjResponse.data[lcintI].sucnombre + "</h5>";
						}
						lcstrHtml += "<div class='card-action'>";
						lcstrHtml += "<div class='row between-xs'>";
						lcstrHtml += "<div class='col-xs-12 align-right'>";
						lcstrHtml += "<div class='box'>";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\"><i class='fa fa-usd' style='cursor: pointer;'></i></a>";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick=\"AddToList(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\"><i class='fa fa-cart-plus' style='cursor: pointer;'></i></a>";
						if (lcobjResponse.data[lcintI].sucdistancia > 0.0)
							lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button' onclick='GetPricexLocation(" + lcobjResponse.data[lcintI].preid + ");'><i class='fa fa-map-marker' style='cursor: pointer;'></i></a>";
						if (lcobjResponse.data[lcintI].sucdistancia >= 0.0)
							lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>" + (lcobjResponse.data[lcintI].sucdistancia).formatMoney(0, ',', '.') + " metros</a>";
						else
							lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>WEB</a>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
				else {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>Busqueda de productos por c&oacute;digo</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<p>" + lcobjResponse.error + "</p>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					if (lcobjResponse.errcode == 9) {
						if (lcobjResponse.EAN != "") {							
							lcstrHtml += "<div class='ui-corner-all custom-corners'>";
							lcstrHtml += "<div class='ui-bar ui-bar-a'>";
							lcstrHtml += "<h3>Ingresa la siguiente informaci&oacute;n</h3>";
							lcstrHtml += "</div>";
							lcstrHtml += "<div class='ui-body ui-body-a'>";
							lcstrHtml += "<ul id='ulContribuir' data-role='listview' data-inset='true'>";
							lcstrHtml += "<li class='ui-field-contain'>";
							lcstrHtml += "<label for='txtEAN'>C&oacute;digo de Barras:</label>";
							lcstrHtml += "<input type='text' name='txtEAN' id='txtEAN' value='" + lcobjResponse.EAN + "' disabled='disabled' />";
							lcstrHtml += "</li>";
							lcstrHtml += "<li class='ui-field-contain'>";
							lcstrHtml += "<label for='txtProducto'>Producto:</label>";
							lcstrHtml += "<input type='text' name='txtProducto' id='txtProducto' value='' data-clear-btn='true' placeholder='Nombre del producto' />";
							lcstrHtml += "</li>";
							lcstrHtml += "<li class='ui-field-contain'>";
							lcstrHtml += "<label for='txtUbicacion'>Donde lo encontraste:</label>";
							lcstrHtml += "<select name='txtUbicacion' id='txtUbicacion'>";
							lcstrHtml += "<option value=''>-- SELECCIONE ESTABLECIMIENTO --</option>";
							for (lcintI = 0; lcintI < lcobjResponse.sucursales.length; lcintI++)
								lcstrHtml += "<option value='" + lcobjResponse.sucursales[lcintI].sucid + "'>" + lcobjResponse.sucursales[lcintI].sucnombre + "</option>";
							lcstrHtml += "</select>";
							lcstrHtml += "</li>";
							lcstrHtml += "<li class='ui-field-contain'>";
							lcstrHtml += "<label for='txtNuevaUbicacion'>No estaba en la lista? Agr&eacute;gala aqui:</label>";
							lcstrHtml += "<input type='text' name='txtNuevaUbicacion' id='txtNuevaUbicacion' value='' data-clear-btn='true' placeholder='Nombre del nuevo establecimiento' />";
							lcstrHtml += "</li>";
							lcstrHtml += "<li class='ui-field-contain'>";
							lcstrHtml += "<label for='txtPrecio'>Precio:</label>";
							lcstrHtml += "<input type='number' name='txtPrecio' id='txtPrecio' value='' data-clear-btn='true' placeholder='Precio del producto' />";
							lcstrHtml += "</li>";
							lcstrHtml += "<li class='ui-field-contain'>";
							lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='ContributeProduct();'>Enviar</button>";
							lcstrHtml += "</li>";
							lcstrHtml += "</ul>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							//lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
						}
					}
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
					$('#ulContribuir').listview().listview('refresh');
					$('#txtUbicacion').selectmenu().selectmenu("refresh"); 
					$('[type="text"]').textinput().textinput('refresh');
					$('[type="button"]').button().button('refresh');
					$('[type="number"]').textinput().textinput('refresh');
				}
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetBarCodeData)");
	}
}

function GetContributeText(vlobjResponse) {
	var lcstrHtml = "";
	
	try {							
		lcstrHtml += "<div class='ui-corner-all custom-corners'>";
		lcstrHtml += "<div class='ui-bar ui-bar-a'>";
		lcstrHtml += "<h3>Sugerir precio</h3>";
		lcstrHtml += "</div>";
		lcstrHtml += "<div class='ui-body ui-body-a'>";
		lcstrHtml += "<ul id='ulContribuir' data-role='listview' data-inset='true'>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<label for='txtUbicacion'>Donde lo encontraste:</label>";
		lcstrHtml += "<select name='txtUbicacion' id='txtUbicacion'>";
		lcstrHtml += "<option value=''>-- SELECCIONE ESTABLECIMIENTO --</option>";
		for (lcintI = 0; lcintI < vlobjResponse.sucursales.length; lcintI++)
			lcstrHtml += "<option value='" + vlobjResponse.sucursales[lcintI].sucid + "'>" + vlobjResponse.sucursales[lcintI].sucnombre + "</option>";
		lcstrHtml += "</select>";
		lcstrHtml += "</li>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<label for='txtNuevaUbicacion'>No estaba en la lista? Agr&eacute;gala aqui:</label>";
		lcstrHtml += "<input type='text' name='txtNuevaUbicacion' id='txtNuevaUbicacion' value='' data-clear-btn='true' placeholder='Nombre del nuevo establecimiento' />";
		lcstrHtml += "</li>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<label for='txtPrecio'>Precio:</label>";
		lcstrHtml += "<input type='number' name='txtPrecio' id='txtPrecio' value='' data-clear-btn='true' placeholder='Precio del producto' />";
		lcstrHtml += "</li>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='ContributePrice(" + vlobjResponse.proid + ");'>Enviar</button>";
		lcstrHtml += "</li>";
		lcstrHtml += "</ul>";
		lcstrHtml += "</div>";
		lcstrHtml += "</div>";
		//lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetContributeText)");
	}
	
	return lcstrHtml;
}
			
function GetImageOwner(vlstrPhoto) {
	var lcstrResponse = vlstrPhoto;
	
	try {					
		lcintPos = lcstrResponse.indexOf("://");
		if (lcintPos >= 0) {
			lcstrResponse = lcstrResponse.substr(lcintPos + 3);
			lcintPos = lcstrResponse.indexOf("/");
			if (lcintPos >= 0)
				lcstrResponse = lcstrResponse.substr(0, lcintPos);
			lcstrResponse = lcstrResponse.replace("www.", "").replace("WWW.", "");
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetImageOwner)");
	}
	
	return lcstrResponse;
}
			
function GetListInfo(vllisID) {
	var lcsucID = "";
	
	try {
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			if (document.getElementById("txtSucursales"))
				lcsucID = "" + document.getElementById("txtSucursales").value;
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETLISTINFO&LISID=" + vllisID + "&SUCID=" + lcsucID + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = GetListInfoData;
			pvobjRequest.send(null);
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetListInfo)");
	}
}

function GetListInfoData(vlstrResponse) {
	var lcintTotal = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel = 1;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>" + lcobjResponse.lisnombre + "</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<ul id='ulLista' data-role='listview' data-inset='true'>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtSucursales'>Seleccione sucursal para consultar precios:</label>";
					lcstrHtml += "<select name='txtSucursales' id='txtSucursales' onchange='GetListInfo(" + lcobjResponse.lisid + ");'>";
					lcstrHtml += "<option value=''>-- SELECCIONE SUCURSAL --</option>";
					for (lcintI = 0; lcintI < lcobjResponse.sucursales.length; lcintI++) {
						if ("" + lcobjResponse.sucid != "" && "" + lcobjResponse.sucid == "" + lcobjResponse.sucursales[lcintI].sucid)
							lcstrHtml += "<option value='" + lcobjResponse.sucursales[lcintI].sucid + "' selected>" + lcobjResponse.sucursales[lcintI].sucnombre + "</option>";
						else
							lcstrHtml += "<option value='" + lcobjResponse.sucursales[lcintI].sucid + "'>" + lcobjResponse.sucursales[lcintI].sucnombre + "</option>";
					}
					lcstrHtml += "</select>";
					lcstrHtml += "</li>";
					lcstrHtml += "</ul>";
					for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++) {
						lcstrHtml += "<div class='nd2-card card-media-right card-media-small'>";
						lcstrHtml += "<div class='card-media'>";
						if ("" + lcobjResponse.data[lcintI].profoto != "")
							lcstrHtml += "<img src='" + lcobjResponse.data[lcintI].profoto + "' />";
						else
							lcstrHtml += "<img src='img/blank.png' />";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='card-title has-supporting-text has-action'>";
						lcstrHtml += "<h5 class='card-subtitle'><b>" + lcobjResponse.data[lcintI].pronombre + "</b></h5>";
						lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].proean + "</h5>";
						if (lcobjResponse.data[lcintI].prevalor > 0.0) {
							if (lcobjResponse.data[lcintI].prevalorpromo > 0.0)
								lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].dlicantidad + " x <strike>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + "</strike>&nbsp;<font color='red'>$" + (lcobjResponse.data[lcintI].prevalorpromo).formatMoney(0, ',', '.') + "</font> (" + lcobjResponse.data[lcintI].usualias + ")</h5>";
							else
								lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].dlicantidad + " x $" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + " (" + lcobjResponse.data[lcintI].usualias + ")</h5>";
							lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].prefecha + "</h5>";
						}
						else {
							if ("" + lcobjResponse.sucid != "")
								lcstrHtml += "<h5 class='card-subtitle'><font color='red'>*** PRECIO NO ENCONTRADO ***</font></h5>";
						}
						lcstrHtml += "<div class='card-action'>";
						lcstrHtml += "<div class='row between-xs'>";
						lcstrHtml += "<div class='col-xs-12 align-right'>";
						lcstrHtml += "<div class='box'>";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick=\"DeleteFromList(" + lcobjResponse.lisid + ", " + lcobjResponse.data[lcintI].proid + ");\"><i class='fa fa-trash' style='cursor: pointer;'></i></a>";
						if (lcobjResponse.data[lcintI].prevalor > 0.0) {
							if (lcobjResponse.data[lcintI].prevalorpromo > 0.0) {
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>$" + (lcobjResponse.data[lcintI].prevalorpromo * lcobjResponse.data[lcintI].dlicantidad).formatMoney(0, ',', '.') + "</a>";
								lcintTotal += lcobjResponse.data[lcintI].prevalorpromo * lcobjResponse.data[lcintI].dlicantidad;
							}
							else {
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>$" + (lcobjResponse.data[lcintI].prevalor * lcobjResponse.data[lcintI].dlicantidad).formatMoney(0, ',', '.') + "</a>";
								lcintTotal += lcobjResponse.data[lcintI].prevalor * lcobjResponse.data[lcintI].dlicantidad;
							}
						}
						else {
							if ("" + lcobjResponse.sucid != "")
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'><font color='red'>$0</font></a>";
							else
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'><i class='fa fa-question' aria-hidden='true'></i></a>";
						}
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					if (lcintTotal > 0) {
						lcstrHtml += "<div class='nd2-card card-media-right card-media-small'>";
						lcstrHtml += "<div class='card-media'><img src='img/blank.png' /></div>";
						lcstrHtml += "<div class='card-title has-supporting-text has-action'>";
						lcstrHtml += "<h5 class='card-subtitle'><b>Total<b></h5>";
						lcstrHtml += "<div class='card-action'>";
						lcstrHtml += "<div class='row between-xs'>";
						lcstrHtml += "<div class='col-xs-12 align-right'>";
						lcstrHtml += "<div class='box'>";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>$" + (lcintTotal).formatMoney(0, ',', '.') + "</a>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
					$('#ulLista').listview().listview('refresh');
					$('#txtSucursales').selectmenu().selectmenu("refresh"); 
					$('[type="button"]').button().button('refresh');
				}
				else
					ShowMessage("Listas de Mercado", lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetListInfoData)");
	}
}

function GetLists() {
	try {
		if (pvstrAccount != "" && pvstrDeviceID != "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETLISTS&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = GetListsData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
		else {
			MsgBox("Para poder ejecutar esta acci&oacute;n debe registrase primero.");
			setTimeout(GetUser, 100);
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetLists)");
	}
}

function GetListsData(vlstrResponse) {
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel = 1;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					if (lcobjResponse.data.length > 0) {
						lcstrHtml += "<div class='ui-corner-all custom-corners'>";
						lcstrHtml += "<div class='ui-bar ui-bar-a'>";
						lcstrHtml += "<h3>Listas de Mercado</h3>";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='ui-body ui-body-a'>";
						lcstrHtml += "<ul id='ulListas' data-role='listview' data-inset='true'>";
						for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++)
							lcstrHtml += "<li><a href='#' onclick='GetListInfo(" + lcobjResponse.data[lcintI].lisid + ");'>" + lcobjResponse.data[lcintI].lisnombre + " <span class='ui-li-count ui-body-b'>" + lcobjResponse.data[lcintI].count + "</span></a></li>";
						lcstrHtml += "</ul>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						pvstrBack[pvintNivel] = lcstrHtml;
						document.getElementById("divContent").innerHTML = lcstrHtml;
						$('#ulListas').listview().listview('refresh');
						$('[type="button"]').button().button('refresh');
					}
					else
						ShowMessage("Listas de Mercado", "Usted no tiene ninguna lista de mercado creada a&uacute;n. Para crear una, busque los productos deseados y haga click en <i class='fa fa-cart-plus'></i> para adicionarlo a una lista o crear una nueva.");
				}
				else
					ShowMessage("Listas de Mercado", lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetListsData)");
	}
}

function GetNextImage() {
	try {
		if (pvintImageIndex < pvintImageCount) {
			if (document.getElementById("imgFoto"))
				document.getElementById("imgFoto").src = "img/loading.gif";
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETNEXTIMAGE&PROID=" + pvproID + "&PROEAN=" + pvproEAN + "&INDEX=" + pvintImageIndex + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = GetNextImageData;
				pvobjRequest.send(null);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetNextImage)");
	}
}

function GetNextImageData() {
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					pvintImageIndex++;
					if (document.getElementById("imgFoto"))
						document.getElementById("imgFoto").src = lcobjResponse.profoto;
					if (document.getElementById("lblFotoCredito"))
						document.getElementById("lblFotoCredito").innerHTML = "Foto: " + GetImageOwner(lcobjResponse.profoto);
					if (document.getElementById("lblAliasUsuario")) {
						if ("" + lcobjResponse.profotoalias != "")
							document.getElementById("lblAliasUsuario").innerHTML = "Usuario: " + lcobjResponse.profotoalias;
						else
							document.getElementById("lblAliasUsuario").innerHTML = "";
					}
					if (document.getElementById("iPrev"))
						document.getElementById("iPrev").style.visibility = "visible";
					if (document.getElementById("iNext")) {
						if (pvintImageIndex < pvintImageCount)
							document.getElementById("iNext").style.visibility = "visible";
						else
							document.getElementById("iNext").style.visibility = "hidden";
					}
				}
				else
					MsgBox(lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetNextImageData)");
	}
}

function GetPictureOptions() {
    var lcobjOptions = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
		cameraDirection: Camera.Direction.BACK,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return lcobjOptions;
}

function GetPreviousImage() {
	try {
		if (pvintImageIndex > 1) {
			if (document.getElementById("imgFoto"))
				document.getElementById("imgFoto").src = "img/loading.gif";
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPREVIOUSIMAGE&PROID=" + pvproID + "&PROEAN=" + pvproEAN + "&INDEX=" + pvintImageIndex + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = GetPreviousImageData;
				pvobjRequest.send(null);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetPreviousImage)");
	}
}

function GetPreviousImageData() {
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					pvintImageIndex--;
					if (document.getElementById("imgFoto"))
						document.getElementById("imgFoto").src = lcobjResponse.profoto;
					if (document.getElementById("lblFotoCredito"))
						document.getElementById("lblFotoCredito").innerHTML = "Foto: " + GetImageOwner(lcobjResponse.profoto);
					if (document.getElementById("lblAliasUsuario")) {
						if ("" + lcobjResponse.profotoalias != "")
							document.getElementById("lblAliasUsuario").innerHTML = "Usuario: " + lcobjResponse.profotoalias;
						else
							document.getElementById("lblAliasUsuario").innerHTML = "";
					}
					if (document.getElementById("iNext"))
						document.getElementById("iNext").style.visibility = "visible";
					if (document.getElementById("iPrev")) {
						if (pvintImageIndex > 1)
							document.getElementById("iPrev").style.visibility = "visible";
						else
							document.getElementById("iPrev").style.visibility = "hidden";
					}
				}
				else
					MsgBox(lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetPreviousImageData)");
	}
}

function GetPrices(vlintProductID, vlstrProductName, vlstrProductPhoto, vlstrProductEAN, vlstrPhotoAlias, vlintPhotoCount) {
	var lcstrRequest = "";
	var lcstrUserPhoto = "";
	
	try {		
		pvintImageIndex = 1;
		pvproID = vlintProductID;
		pvproNombre = vlstrProductName;
		pvproEAN = vlstrProductEAN;
		pvproFotoAlias = vlstrPhotoAlias;
		pvintImageCount = vlintPhotoCount;
		if (vlstrProductPhoto != "") {
			if (pvproFotoAlias != "")
				lcstrUserPhoto = "<br /><span id='lblAliasUsuario'>Usuario: " + pvproFotoAlias + "</span>";
			else
				lcstrUserPhoto = "<br /><span id='lblAliasUsuario'></span>";
			lcintPos = vlstrProductPhoto.indexOf("://");
			if (lcintPos >= 0) {
				lcstrCredito = vlstrProductPhoto.substr(lcintPos + 3);
				lcintPos = lcstrCredito.indexOf("/");
				if (lcintPos >= 0)
					lcstrCredito = lcstrCredito.substr(0, lcintPos);
				lcstrCredito = lcstrCredito.replace("www.", "").replace("WWW.", "");
				pvproFoto = "<p align='center'><img id='imgFoto' src='" + vlstrProductPhoto + "' style='height: 200px' onclick='TakePicture();' /><br />" + vlstrProductEAN + "<br /><span id='lblFotoCredito'>Foto: " + lcstrCredito + "</span>" + lcstrUserPhoto + "</p>";
			}
			else
				pvproFoto = "<p align='center'><img id='imgFoto' src='" + vlstrProductPhoto + "' style='height: 200px' onclick='TakePicture();' /><br />" + vlstrProductEAN + "</p>";
		}
		else
			pvproFoto = "<p align='center'><img id='imgFoto' src='img/noimage.jpg' style='cursor: pointer; height: 200px' onclick='TakePicture();' /><br />" + vlstrProductEAN + "</p>";
		
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRECIOS&PROID=" + vlintProductID + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = GetPricesData;
			pvobjRequest.send(null);
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Search)");
	}
}

function GetPricesData() {
	var lcbooAddFooter = true;
	var lcintI = 0;
	var lcstrHtml = "";
	var lcstrPrevSuc = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel = 2;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>" + lcobjResponse.pronombre + "</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div id='divFoto' class='ui-body ui-body-a'>";
					lcstrHtml += "<table style='width: 100%'>";
					lcstrHtml += "<tr>";
					lcstrHtml += "<td style='width: 10%; text-align: center; vertical-align: middle;'>";
					if (pvintImageCount > 1)
						lcstrHtml += "<i id='iPrev' class='fa fa-chevron-left fa-2x' style='cursor: pointer; visibility: hidden;' onclick='GetPreviousImage();'></i></td>";
					else
						lcstrHtml += "</td>";
					lcstrHtml += "<td id='tdFoto' style='width: 80%; text-align: center; vertical-align: middle;'>";
					if (pvproFoto != "")
						lcstrHtml += pvproFoto;
					lcstrHtml += "</td>";
					lcstrHtml += "<td style='width: 10%; text-align: center; vertical-align: middle;'>";
					if (pvintImageCount > 1)
						lcstrHtml += "<i id='iNext' class='fa fa-chevron-right fa-2x' style='cursor: pointer; visibility: visible;' onclick='GetNextImage();'></i></td>";
					else
						lcstrHtml += "</td>";
					lcstrHtml += "<tr>";
					lcstrHtml += "</table>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					
					for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++) {
						if (lcstrPrevSuc != "" + lcobjResponse.data[lcintI].sucid) {
							lcstrHtml += "<div class='nd2-card'>";
							lcstrHtml += "<div class='card-title has-supporting-text'>";
						}
						if ("" + lcobjResponse.data[lcintI].prevalorpromo != "0")
							lcstrHtml += "<h3 class='card-primary-title'><strike>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + "</strike>&nbsp;<font color='red'>$" + (lcobjResponse.data[lcintI].prevalorpromo).formatMoney(0, ',', '.') + "</font> (" + lcobjResponse.data[lcintI].usualias + ")&nbsp;&nbsp;<i class='fa fa-check' title='Es precio es correcto.' style='cursor: pointer;' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 1);'></i>&nbsp;&nbsp;(<span id='lblValoracion" + lcobjResponse.data[lcintI].preid + "'>" + lcobjResponse.data[lcintI].prevaloracion + "</span>)&nbsp;&nbsp;<i class='fa fa-times' style='cursor: pointer;' title='Es precio NO es correcto.' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 0);'></i></h3>";
						else
							lcstrHtml += "<h3 class='card-primary-title'>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + " (" + lcobjResponse.data[lcintI].usualias + ")&nbsp;&nbsp;<i class='fa fa-check' style='cursor: pointer;' title='Es precio es correcto.' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 1);'></i>&nbsp;&nbsp;(<span id='lblValoracion" + lcobjResponse.data[lcintI].preid + "'>" + lcobjResponse.data[lcintI].prevaloracion + "</span>)&nbsp;&nbsp;<i class='fa fa-times' title='Es precio NO es correcto.' style='cursor: pointer;' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 0);'></i></h3>";
						lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].prefecha + "<br />" + lcobjResponse.data[lcintI].sucnombre + "</h5>";
						lcbooAddFooter = true;
						if ((lcintI + 1) < lcobjResponse.data.length) {
							if ("" + lcobjResponse.data[lcintI].sucid == "" + lcobjResponse.data[lcintI + 1].sucid)
								lcbooAddFooter = false;
						}
						if (lcbooAddFooter) {
							lcstrHtml += "</div>";
							lcstrHtml += "<div class='card-action'>";
							lcstrHtml += "<div class='row between-xs'>";
							lcstrHtml += "<div class='col-xs-4'>";
							lcstrHtml += "<div class='box'>";
							if (lcobjResponse.data[lcintI].sucdistancia > 0.0)
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button' onclick='GetPricexLocation(" + lcobjResponse.data[lcintI].preid + ");'><i class='fa fa-map-marker' style='cursor: pointer;'></i></a>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "<div class='col-xs-8 align-right'>";
							lcstrHtml += "<div class='box'>";
							if (lcobjResponse.data[lcintI].sucdistancia >= 0.0)
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>" + (lcobjResponse.data[lcintI].sucdistancia).formatMoney(0, ',', '.') + " metros</a>";
							else
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>WEB</a>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
						}
						lcstrPrevSuc = "" + lcobjResponse.data[lcintI].sucid;
					}
					lcstrHtml += GetContributeText(lcobjResponse);
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
					if (pvstrPostMessage != "")
						MsgBox(pvstrPostMessage);
				}
				else {
					if (pvproFoto != "" && pvproNombre != "") {							
						lcstrHtml += "<div class='ui-corner-all custom-corners'>";
						lcstrHtml += "<div class='ui-bar ui-bar-a'>";
						lcstrHtml += "<h3>" + pvproNombre + "</h3>";
						lcstrHtml += "</div>";
						lcstrHtml += "<div id='divFoto' class='ui-body ui-body-a'>";
						lcstrHtml += "<table style='width: 100%'>";
						lcstrHtml += "<tr>";
						lcstrHtml += "<td style='width: 10%; text-align: center; vertical-align: middle;'>";
						if (pvintImageCount > 1)
							lcstrHtml += "<i id='iPrev' class='fa fa-chevron-left fa-2x' style='cursor: pointer; visibility: hidden;' onclick='GetPreviousImage();'></i></td>";
						else
							lcstrHtml += "</td>";
						lcstrHtml += "<td id='tdFoto' style='width: 80%; text-align: center; vertical-align: middle;'>";
						if (pvproFoto != "")
							lcstrHtml += pvproFoto;
						lcstrHtml += "</td>";
						lcstrHtml += "<td style='width: 10%; text-align: center; vertical-align: middle;'>";
						if (pvintImageCount > 1)
							lcstrHtml += "<i id='iNext' class='fa fa-chevron-right fa-2x' style='cursor: pointer; visibility: visible;' onclick='GetNextImage();'></i></td>";
						else
							lcstrHtml += "</td>";
						lcstrHtml += "<tr>";
						lcstrHtml += "</table>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>Busqueda de precios</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<p>" + lcobjResponse.error + "</p>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					if (lcobjResponse.errcode == 9) {
						if (lcobjResponse.proid != "")
							lcstrHtml += GetContributeText(lcobjResponse);
					}
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
				$('#ulContribuir').listview().listview('refresh');
				$('#txtUbicacion').selectmenu().selectmenu("refresh"); 
				$('[type="text"]').textinput().textinput('refresh');
				$('[type="button"]').button().button('refresh');
				$('[type="number"]').textinput().textinput('refresh');
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetPricesData)");
	}
	
	pvstrPostMessage = "";
}

function GetPricexLocation(vlintPreID) {
	var lcstrRequest = "";
	
	try {
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRECIOXUBICACION&PREID=" + vlintPreID + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = GetPricexLocationData;
			pvobjRequest.send(null);
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetPricexLocation)");
	}
}

function GetPricexLocationData() {
	var lcintI = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel++;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					document.getElementById("divContent").innerHTML = "<div id='map_canvas' style='width:100%; height:500px'></div>";
					var lcobjLatLng = new google.maps.LatLng(pvdblLatitud, pvdblLongitud);
					var lcoptOptions = {
						zoom: 15,
						center: lcobjLatLng,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					pvobjMAP = new google.maps.Map(document.getElementById('map_canvas'), lcoptOptions);
					var lcobjIcon = new google.maps.MarkerImage('img/user.png', new google.maps.Size(24, 24), new google.maps.Point(0, 0), new google.maps.Point(0, 24));
					var lcobjUser = new google.maps.Marker({position: lcobjLatLng, icon: lcobjIcon, map: pvobjMAP, title:"Mi ubicaci&oacute;n"});
					lcobjUser.setMap(pvobjMAP);
					var lcobjPoint = new google.maps.LatLng(lcobjResponse.suclatitud, lcobjResponse.suclongitud);
					var lcobjMarker = new google.maps.Marker({position: lcobjPoint, map: pvobjMAP, title:lcobjResponse.sucnombre});
					lcobjMarker.setMap(pvobjMAP);
				}
				else {
					MsgBox(lcobjResponse.error);
				}
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetPricexLocationData)");
	}
}

function GetScannedProduct(vlstrEAN) {
	try {
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETCODIGO&PRO=" + vlstrEAN + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = GetBarCodeData;
			pvobjRequest.send(null);
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetScannedProduct)");
	}
}

function GetStorage(vlstrVariable, vlstrDefault) {
	var lcstrResponse = "";
	
	try {
		if (window.localStorage) {
			lcstrResponse = "" + window.localStorage.getItem(vlstrVariable);
			if (lcstrResponse == "" || lcstrResponse == "null" || lcstrResponse == "undefined") {
				window.localStorage.setItem(vlstrVariable, vlstrDefault);
				lcstrResponse = "";
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetStorage)");
	}
	
	return lcstrResponse;
}

function GetUser() {
	var lcstrHtml = "";
	
	try {
		if (pvstrAccount != "" && pvstrDeviceID != "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETUSER&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = GetUserData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
		else {
			lcstrHtml += "<div class='ui-corner-all custom-corners'>";
			lcstrHtml += "<div class='ui-bar ui-bar-a'>";
			if (pvstrDeviceID != "")
				lcstrHtml += "<h3>Preferencias del usuario<br />[" + pvstrDeviceID + "]<br />Versi&oacute;n: " + pvstrVersion + "</h3>";
			else
				lcstrHtml += "<h3>Preferencias del usuario<br />[***** DEVICEID ERROR *****]<br />Versi&oacute;n: " + pvstrVersion + "</h3>";
			lcstrHtml += "</div>";
			lcstrHtml += "<div class='ui-body ui-body-a'>";
			lcstrHtml += "<ul id='ulOpciones' data-role='listview' data-inset='true'>";
			lcstrHtml += "<li class='ui-field-contain'>";
			lcstrHtml += "<label for='txtEmail'>Email:</label>";
			lcstrHtml += "<input type='email' name='txtEmail' id='txtEmail' value='' data-clear-btn='true' placeholder='Email del usuario' />";
			lcstrHtml += "</li>";
			lcstrHtml += "<li class='ui-field-contain'>";
			lcstrHtml += "<label for='txtAlias'>Seud&oacute;nimo:</label>";
			lcstrHtml += "<input type='text' name='txtAlias' id='txtAlias' value='' maxlength='15' data-clear-btn='true' placeholder='Seud&oacute;nimo' />";
			lcstrHtml += "</li>";
			lcstrHtml += "<li class='ui-field-contain'>";
			lcstrHtml += "<label for='txtDistancia'>Distancia máxima a buscar (Km):</label>";
			lcstrHtml += "<input type='number' data-type='range' name='txtDistancia' id='txtDistancia' value='" + pvintDistanciaMax + "' min='1' max='50' step='1' data-highlight='true'>";
			lcstrHtml += "</li>";
			lcstrHtml += "<li class='ui-field-contain'>";
			lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='Register();'>Registrarme</button>";
			lcstrHtml += "</li>";
			lcstrHtml += "</ul>";
			lcstrHtml += "</div>";
			lcstrHtml += "</div>";
			//lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
			document.getElementById("divContent").innerHTML = lcstrHtml;
			$('#ulOpciones').listview().listview('refresh');
			$('[type="text"]').textinput().textinput('refresh');
			$('[type="email"]').textinput().textinput('refresh');
			$('[type="button"]').button().button('refresh');
			$('[type="number"]').slider().slider('refresh');
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetUser)");
	}
}

function GetUserData() {
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel = 1;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					if (pvstrDeviceID != "")
						lcstrHtml += "<h3>Preferencias del usuario<br />[" + pvstrDeviceID + "]<br />Versi&oacute;n: " + pvstrVersion + "</h3>";
					else
						lcstrHtml += "<h3>Preferencias del usuario<br />[***** DEVICEID ERROR *****]<br />Versi&oacute;n: " + pvstrVersion + "</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<ul id='ulOpciones' data-role='listview' data-inset='true'>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtEmail'>Email:</label>";
					lcstrHtml += "<input type='email' name='txtEmail' id='txtEmail' value='" + lcobjResponse.email + "' data-clear-btn='true' placeholder='Email del usuario' disabled='disabled' />";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtAlias'>Seud&oacute;nimo:</label>";
					lcstrHtml += "<input type='text' name='txtAlias' id='txtAlias' value='" + lcobjResponse.alias + "' maxlength='15' data-clear-btn='true' placeholder='Seud&oacute;nimo' />";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtDistancia'>Distancia máxima a buscar (Km):</label>";
					lcstrHtml += "<input type='number' data-type='range' name='txtDistancia' id='txtDistancia' value='" + pvintDistanciaMax + "' min='1' max='50' step='1' data-highlight='true'>";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='UpdateUser();'>Guardar</button>";
					lcstrHtml += "</li>";
					lcstrHtml += "</ul>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					//lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
					document.getElementById("divContent").innerHTML = lcstrHtml;
					$('#ulOpciones').listview().listview('refresh');
					$('[type="text"]').textinput().textinput('refresh');
					$('[type="email"]').textinput().textinput('refresh');
					$('[type="button"]').button().button('refresh');
					$('[type="number"]').slider().slider('refresh');
				}
				else
					ShowMessage("Registro", lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetUserData)");
	}
}

function GetUserLocation(position) {
	var lcstrRequest = "";
	
	try {
		pvdblLatitud = position.coords.latitude; 
		pvdblLongitud = position.coords.longitude;
		if (pvbooStartup && pvstrAccount != "" && pvstrDeviceID != "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				pvintPromoPage = 0;
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=STARTUP&PAGE=" + pvintPromoPage + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = StartupData;
				pvobjRequest.send(null);
			}
			pvbooStartup = false;
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetUserLocation)");
	}
}

function GetUserLocationError(error) {
	try {
		MsgBox("No fu&eacute; posible obtener la ubicaci&oacute;n del usuario. Error: " + error.code + " - " + error.message);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetUserLocationError)");
	}
}
			
function Home() {
	try {
		pvintNivel = 1;
		setTimeout(Back, 100);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Home)");
	}
}

function Initialize() {
	try {
		var lcstrVersion = GetStorage("AH_VERSION", "");
		if (pvstrVersion != lcstrVersion)
			setTimeout(ShowTerms, 100);
		else {
			if (pvstrAccount != "" && pvstrDeviceID != "")
				setTimeout(InitializeGPS, 100);
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Initialize)");
	}
}

function InitializeGPS() {
	try {
		if (!pvbooGPSInitialized) {
			pvbooGPSInitialized = true;
			if (navigator.geolocation) {
				try {
					navigator.geolocation.watchPosition(GetUserLocation, GetUserLocationError);
				}
				catch (ee) {
					MsgBox("Su navegador no permite obtener su ubicaci&oacute;n.");
				}
			}
			else
				MsgBox("Su navegador no acepta la funcionalidad de ubicaci&oacute;n.");
		}
		if (AdMob) AdMob.prepareInterstitial( { adId:admobid.interstitial, autoShow:true } );
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (InitializeGPS)");
	}
}

function MsgBox(vlstrMessage) {
	try {
		new $.nd2Toast({ // The 'new' keyword is important, otherwise you would overwrite the current toast instance
			message : vlstrMessage, // Required
			ttl : 3000 // optional, time-to-live in ms (default: 3000)
		 });
	}
	catch (ee) {
		alert(vlstrMessage);
	}
}

function NextPage() {
	var lcstrRequest = "";
	
	try {
		pvintPage++;
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRODUCTOS&PAGE=" + pvintPage + "&PRO=" + window.btoa(pvstrSearchData) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = SearchData;
			pvobjRequest.send(null);
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (NextPage)");
	}
}
			
function NextPromoPage() {
	try {
		pvintPromoPage++;
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=STARTUP&PAGE=" + pvintPromoPage + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = StartupData;
			pvobjRequest.send(null);
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (NextPromoPage)");
	}
}

function PreviousPage() {
	var lcstrRequest = "";
	
	try {
		if (pvintPage > 0) {
			pvintPage--;
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRODUCTOS&PAGE=" + pvintPage + "&PRO=" + window.btoa(pvstrSearchData) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = SearchData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (PreviousPage)");
	}
}
			
function PreviousPromoPage() {
	try {
		if (pvintPromoPage > 0) {
			pvintPromoPage--;
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=STARTUP&PAGE=" + pvintPromoPage + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = StartupData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (PreviousPromoPage)");
	}
}
			
function Register() {
	var lcstrError = "";
	
	try {
		if ("" + document.getElementById("txtEmail").value == "" && lcstrError == "")
			lcstrError = "El campo Email es requerido.";
		if (!ValidateEmail("" + document.getElementById("txtEmail").value) && lcstrError == "")
			lcstrError = "El campo Email es incorrecto.";
		if (pvstrDeviceID == "" && lcstrError == "")
			lcstrError = "Ocurri&oacute; un problema al obtener ID del dispositivo.";
		if ("" + document.getElementById("txtAlias").value != "" && lcstrError == "") {
			if (!ValidateInput("" + document.getElementById("txtAlias").value))
				lcstrError = "El campo Seud&oacute;nimo solo puede contener letras, n&uacute;meros o _.";
		}
		if (lcstrError == "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=REGISTER&ACCOUNT=" + document.getElementById("txtEmail").value + "&DEVICEID=" + pvstrDeviceID + "&ALIAS=" + document.getElementById("txtAlias").value + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = RegisterData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
		else
			MsgBox(lcstrError);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Register)");
	}
}

function RegisterData() {
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					SetStorage("AH_EMAIL", "" + lcobjResponse.email);
					pvstrAccount = GetStorage("AH_EMAIL", "");
					ShowMessage("Registro", lcobjResponse.error);
				}
				else {
					if (lcobjResponse.errcode == 99) {
						SetStorage("AH_EMAIL", "" + lcobjResponse.email);
						pvstrAccount = GetStorage("AH_EMAIL", "");
					}
					ShowMessage("Registro", lcobjResponse.error);
				}
				setTimeout(InitializeGPS, 100);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (RegisterData)");
	}
}

function Scan() {
	var lcstrRequest = "";
	
	try {
		if (pvstrAccount != "" && pvstrDeviceID != "") {
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					if (result.text != "") {
						pvobjRequest = getXmlHttpRequestObject();
						if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
							lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETCODIGO&PRO=" + result.text + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
							console.log(">> " + lcstrRequest);
							pvobjRequest.open("GET", lcstrRequest, true);
							pvobjRequest.onreadystatechange = GetBarCodeData;
							pvobjRequest.send(null);
							document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
							document.getElementById("txtBuscar").value = "";
						}
					}
				},
				function (error) {
					MsgBox("Fall&oacute; la lectura del c&oacute;digo de barras. " + error);
				},
				{
					preferFrontCamera : false, // iOS and Android
					showFlipCameraButton : true, // iOS and Android
					showTorchButton : true, // iOS and Android
					torchOn: false, // Android, launch with the torch switched on (if available)
					prompt : "Posicione el código de barras dentro del area", // Android
					resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
					formats : "EAN_13,EAN_8", // default: all but PDF_417 and RSS_EXPANDED
					orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
					disableAnimations : true, // iOS
					disableSuccessBeep: false // iOS
				}
			);
		}
		else {
			MsgBox("Para poder ejecutar esta acci&oacute;n debe registrase primero.");
			setTimeout(GetUser, 100);
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Scan)");
	}
}

function Search() {
	var lcstrRequest = "";
	
	try {
		if (event.key == "Enter" || event.keyCode == 13) {
			if (pvstrAccount != "" && pvstrDeviceID != "") {
				if (("" + document.getElementById("txtBuscar").value).length >= 3) {
					pvintPage = 0;
					pvstrSearchData = "" + document.getElementById("txtBuscar").value;
					pvobjRequest = getXmlHttpRequestObject();
					if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
						lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRODUCTOS&PAGE=0&PRO=" + window.btoa("" + document.getElementById("txtBuscar").value) + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
						console.log(">> " + lcstrRequest);
						pvobjRequest.open("GET", lcstrRequest, true);
						pvobjRequest.onreadystatechange = SearchData;
						pvobjRequest.send(null);
						document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
					}
				}
				else
					alert("Debe ingresar por lo menos 3 letras del producto.");
			}
			else {
				MsgBox("Para poder ejecutar esta acci&oacute;n debe registrase primero.");
				setTimeout(GetUser, 100);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Search)");
	}
}

function SearchData() {
	var lcintI = 0;
	var lcintPage = 0;
	var lcintRows = 0;
	var lcintTotRows = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				pvintNivel = 1;
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcintPage = lcobjResponse.page;
					lcintRows = lcobjResponse.rows;
					lcintTotRows = lcobjResponse.totrows;
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>" + lcintTotRows + " resultados - P&aacute;gina " + (lcintPage + 1) + " de " + (parseInt(lcintTotRows / 20) + 1) + "</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					if (lcintPage > 0)
						lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='PreviousPage();'>Anteriores resultados</button>";
					for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++) {
						lcstrHtml += "<div class='nd2-card card-media-right card-media-small'>";
						lcstrHtml += "<div class='card-media'>";
						if ("" + lcobjResponse.data[lcintI].profoto != "")
							lcstrHtml += "<img src='" + lcobjResponse.data[lcintI].profoto + "' style='cursor: pointer' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\" />";
						else
							lcstrHtml += "<img src='img/noimage.jpg' style='cursor: pointer' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\" />";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='card-title has-supporting-text has-action'>";
						lcstrHtml += "<h5 class='card-subtitle'><b>" + lcobjResponse.data[lcintI].pronombre + "</b></h5>";
						lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].proean + "</h5>";
						if ("" + lcobjResponse.data[lcintI].sucnombre != "") {
							if ("" + lcobjResponse.data[lcintI].prevalorpromo != "0")
								lcstrHtml += "<h5 class='card-subtitle'><strike>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + "</strike>&nbsp;<font color='red'>$" + (lcobjResponse.data[lcintI].prevalorpromo).formatMoney(0, ',', '.') + "</font> (" + lcobjResponse.data[lcintI].usualias + ")</h5>";
							else
								lcstrHtml += "<h5 class='card-subtitle'>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + " (" + lcobjResponse.data[lcintI].usualias + ")</h5>";
							lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].prefecha + "<br />" + lcobjResponse.data[lcintI].sucnombre + "</h5>";
						}
						lcstrHtml += "<div class='card-action'>";
						lcstrHtml += "<div class='row between-xs'>";
						lcstrHtml += "<div class='col-xs-12 align-right'>";
						lcstrHtml += "<div class='box'>";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\"><i class='fa fa-usd' style='cursor: pointer;'></i></a>";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick=\"AddToList(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "', '" + lcobjResponse.data[lcintI].profotoalias + "', " + lcobjResponse.data[lcintI].profotocount + ");\"><i class='fa fa-cart-plus' style='cursor: pointer;'></i></a>";
						if (lcobjResponse.data[lcintI].sucdistancia > 0.0)
							lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button' onclick='GetPricexLocation(" + lcobjResponse.data[lcintI].preid + ");'><i class='fa fa-map-marker' style='cursor: pointer;'></i></a>";
						if (lcobjResponse.data[lcintI].sucdistancia >= 0.0)
							lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>" + (lcobjResponse.data[lcintI].sucdistancia).formatMoney(0, ',', '.') + " metros</a>";
						else
							lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>WEB</a>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					if (lcintRows == 20)
						lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='NextPage();'>Siguientes resultados</button>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
				else
					ShowMessage("Busqueda de precios", lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (SearchData)");
	}
}

function SetStorage(vlstrVariable, vlstrValor) {
	try {
		if (window.localStorage)
			window.localStorage.setItem(vlstrVariable, vlstrValor);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (SetStorage)");
	}
}
			
function SetTutorialPage(vlintPage, vlintDirection) {
	var lcstrHtml = "";
	
	try {
		if (vlintPage == 0) {
			if (vlintDirection == 1) {
				if (pvintTutorialPage == 10)
					pvintTutorialPage = 1;
				else
					pvintTutorialPage++;
			}
			else {
				if (pvintTutorialPage == 1)
					pvintTutorialPage = 10;
				else
					pvintTutorialPage--;
			}
		}
		else
			pvintTutorialPage = vlintPage;
		switch (pvintTutorialPage) {
			case 1:
				document.getElementById("i1").className = "fa fa-circle"
				document.getElementById("i2").className = "fa fa-circle-o"
				document.getElementById("i3").className = "fa fa-circle-o"
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Ahorra es una aplicaci&oacute;n que te permite encontrar y comparar los precios de muchos productos en diferentes establecimientos y as&iacute; tomar una decisi&oacute;n de compra inteligente.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 2:
				document.getElementById("i1").className = "fa fa-circle-o"
				document.getElementById("i2").className = "fa fa-circle"
				document.getElementById("i3").className = "fa fa-circle-o"
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Lo primero que debe hacer es registrarse. Haga click en <i class='fa fa-cog'></i> <b>OPCIONES</b> y reg&iacute;strese en el sistema usando su correo electr&oacute;nico. Le enviaremos un mensaje de confirmaci&oacute;n en el que deber&aacute; hacer click en el enlace <b>Terminar Proceso</b> para completar el registro.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 3:
				document.getElementById("i1").className = "fa fa-circle-o"
				document.getElementById("i2").className = "fa fa-circle-o"
				document.getElementById("i3").className = "fa fa-circle"
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Una vez haya confirmado su registro, podr&aacute; escanear el c&oacute;digo de barras del producto haciendo click en <i class='fa fa-barcode'></i> o introducir la informaci&oacute;n del producto en el campo <b>Producto a buscar ...</b> y visualizar la lista de productos que cumplen con el criterio y cercan&iacute;a.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 4:
				document.getElementById("i1").className = "fa fa-circle-o";
				document.getElementById("i2").className = "fa fa-circle-o";
				document.getElementById("i3").className = "fa fa-circle-o";
				document.getElementById("i4").className = "fa fa-circle";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>En los resultados encontrados podr&aacute; visualizar la informaci&oacute;n del producto, as&iacute; como el precio m&aacute;s bajo encontrado, su fecha y localizaci&oacute;n. Los resultados encontrados se mostrar&aacute;n en bloques de 20 registros.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 5:
				document.getElementById("i1").className = "fa fa-circle-o";
				document.getElementById("i2").className = "fa fa-circle-o";
				document.getElementById("i3").className = "fa fa-circle-o";
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Haga click en <i class='fa fa-usd'></i> para consultar los precios ingresados por la comunidad en los establecimientos, en <i class='fa fa-cart-plus'></i> para adicionar el producto a una lista de mercado y en <i class='fa fa-map-marker'></i> para visualizar la ubicaci&oacute;n f&iacute;sica del establecimiento en el mapa.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 6:
				document.getElementById("i1").className = "fa fa-circle-o";
				document.getElementById("i2").className = "fa fa-circle-o";
				document.getElementById("i3").className = "fa fa-circle-o";
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Puede contribuir con la comunidad haciendo click en <i class='fa fa-check'></i> si el precio es correcto o en <i class='fa fa-times'></i> si no lo es, para el producto del establecimiento en el que se encuentra.</i></h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 7:
				document.getElementById("i1").className = "fa fa-circle-o";
				document.getElementById("i2").className = "fa fa-circle-o";
				document.getElementById("i3").className = "fa fa-circle-o";
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Si no existe ning&uacute;n precio registrado para el producto en el establecimiento o si &eacute;ste no coindice, puede ayudarnos registr&aacute;ndolo y as&iacute; ayudando a que otros usuarios encuentren el mejor precio.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 8:
				document.getElementById("i1").className = "fa fa-circle-o";
				document.getElementById("i2").className = "fa fa-circle-o";
				document.getElementById("i3").className = "fa fa-circle-o";
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Si el establecimiento en el que se encuentra no aparece en la lista desplegable UBICACI&Oacute;N, puede registrarlo en el campo NUEVA UBICACI&Oacute;N.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 9:
				document.getElementById("i1").className = "fa fa-circle-o";
				document.getElementById("i2").className = "fa fa-circle-o";
				document.getElementById("i3").className = "fa fa-circle-o";
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle";
				document.getElementById("i10").className = "fa fa-circle-o";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Haga click sobre la imagen del producto para tomar una nueva foto o en <i class='fa fa-map-marker'></i> para conocer la ubicaci&oacute;n del establecimiento con el precio deseado.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
			case 10:
				document.getElementById("i1").className = "fa fa-circle-o";
				document.getElementById("i2").className = "fa fa-circle-o";
				document.getElementById("i3").className = "fa fa-circle-o";
				document.getElementById("i4").className = "fa fa-circle-o";
				document.getElementById("i5").className = "fa fa-circle-o";
				document.getElementById("i6").className = "fa fa-circle-o";
				document.getElementById("i7").className = "fa fa-circle-o";
				document.getElementById("i8").className = "fa fa-circle-o";
				document.getElementById("i9").className = "fa fa-circle-o";
				document.getElementById("i10").className = "fa fa-circle";
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Utilice la barra inferior para consultar los precios de sus listas de mercado o para regresar en cualquier momento a las opciones o a este tutorial.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (SetTutorialPage)");
	}
}

function ShowMessage(vlstrTitle, vlstrError) {
	var lcstrHtml = "";
	
	try {
		lcstrHtml += "<div class='ui-corner-all custom-corners'>";
		lcstrHtml += "<div class='ui-bar ui-bar-a'>";
		lcstrHtml += "<h3>" + vlstrTitle + "</h3>";
		lcstrHtml += "</div>";
		lcstrHtml += "<div class='ui-body ui-body-a'>";
		lcstrHtml += "<p>" + vlstrError + "</p>";
		lcstrHtml += "<ul id='ulHome' data-role='listview' data-inset='true'>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='Home();'>Volver al inicio</button>";
		lcstrHtml += "</li>";
		lcstrHtml += "</ul>";
		lcstrHtml += "</div>";
		lcstrHtml += "</div>";
		document.getElementById("divContent").innerHTML = lcstrHtml;
		$('#ulHome').listview().listview('refresh');
		$('[type="button"]').button().button('refresh');
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ShowMessage)");
	}
}

function ShowTerms() {
	var lcstrTerms = "";
	
	try {
		lcstrTerms = "LIMITACIÓN DE RESPONSABILIDAD Y GARANTÍA";
		lcstrTerms += "\r\n\r\nEl desarrollador proporciona el servicio y el contenido incluido en el mismo para su uso 'como es' y 'según disponibilidad'. No pueden ser personalizados para satisfacer las necesidades de cada usuario. Rechaza todas las garantías y representaciones, expresas o implícitas, con respecto al servicio, incluyendo, sin limitación, las garantías de comercialización e idoneidad para un propósito particular, características, calidad, no infracción, título, compatibilidad, rendimiento, seguridad o exactitud.";
		lcstrTerms += "\r\n\r\nAdemás y sin excepción a la cláusula anterior, el desarrollador renuncia a cualquier garantía.";
		lcstrTerms += "\r\n\r\nUsted reconoce y acepta que usted asume toda la responsabilidad única y exclusiva para el uso del servicio y que el uso del servicio es bajo su propio riesgo. Usted reconoce que deben observar todas las leyes de tránsito, mientras use del Servicio.";
		lcstrTerms += "\r\n\r\nEl desarrollador hace esfuerzos para ofrecerle una alta calidad y un servicio satisfactorio. Sin embargo, no se garantiza que el servicio funcionará de manera ininterrumpida o sin errores, o que siempre estará disponible o libre de todos los componentes dañinos, o que es seguro, protegido del acceso no autorizado a las computadoras de el desarrollador, inmune a daños y perjuicios, libre de fallas, errores o fallas, incluyendo, pero no limitado a fallas de hardware, fallos de software y fallos de software de comunicación, propiedad de el desarrollador o cualquiera de sus colaboradores.";
		lcstrTerms += "\r\n\r\nEl desarrollador, no se hará responsable de ningún daño directo, indirecto, incidental o consecuente, o cualquier otro daño y pérdida (incluyendo la pérdida de datos) costos, gastos y pagos, ya sea en agravio, contractual o de cualquier otra forma de responsabilidad, derivados de o en conexion con el uso, o de la imposibilidad de uso del servicio o de cualquier fallo, error, o deterioro en las funcion del servicio, o por cualquier tipo de error, o error cometido por el desarrollador o persona que actúe en su nombre, o de su confianza en el contenido del servicio, incluyendo, sin limitación, el contenido son originarios de terceros, o por cualquier tipo de comunicación con el servicio, o con otros usuarios en o a través del servicio o de cualquier negación o cancelación de su cuenta de usuario o de la retención, supresión, comunicación y cualquier otro uso o la pérdida de su contenido en el servicio. En cualquier caso, su única se limita a corregir tales errores, o mal funcionamiento, y a la luz de las circunstancias pertinentes.";
		lcstrTerms += "\r\n\r\nAdemás y sin excepción a la cláusula anterior, el desarrollador no será responsable por ningún tipo de responsabilidad que se derive de su confianza en, o en conexión con el uso del contenido de la información comercial publicado en el Servicio. Dicha información puede ser presentada en los audios del servicio (tales como las indicaciones para la ubicación de los establecimientos, sus ofertas comerciales, etc) o de otra manera.";
		lcstrTerms += "\r\n\r\nEl usuario acepta ceder todos los derechos sobre las imágenes de productos que por él hayan sido fotografiadas desde la aplicación.";
		lcstrTerms += "\r\n\r\nLa aplicación consume datos de internet al consultar la información de productos y precios.";
		lcstrTerms += "\r\n\r\nAcepta la recepción de correos con novedades del producto.";
		navigator.notification.confirm(
			lcstrTerms,
			function (button) {
				if (button == 1) {
					SetStorage("AH_VERSION", pvstrVersion);
					setTimeout(InitializeGPS, 100);
				}
				else
					navigator.app.exitApp();
			},
			'Términos y Condiciones',
			'Ok, Cancelar'
        );
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ShowTerms)");
	}
}

function StartupData() {
	var lcintI = 0;
	var lcintPage = 0;
	var lcintRows = 0;
	var lcintTotRows = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					if (lcobjResponse.best50.data.length > 0) {
						lcstrHtml += "<div class='ui-corner-all custom-corners'>";
						lcstrHtml += "<div class='ui-bar ui-bar-a'>";
						lcstrHtml += "<h3>" + lcobjResponse.best50.title + "</h3>";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='ui-body ui-body-a'>";
						lcstrHtml += "<ol id='ulBest50' data-role='listview' data-inset='true'>";
						for (lcintI = 0; lcintI < lcobjResponse.best50.data.length; lcintI++) {
							lcstrHtml += "<li class='ui-li-has-count ui-first-child'>";
							lcstrHtml += "" + lcobjResponse.best50.data[lcintI].alias + "<span class='ui-li-count ui-body-b'>" + lcobjResponse.best50.data[lcintI].count + "</span>";
							lcstrHtml += "</li>";
						}
						lcstrHtml += "</ol>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					if (lcobjResponse.promo.data.length > 0) {
						lcintPage = lcobjResponse.promo.page;
						lcintRows = lcobjResponse.promo.rows;
						lcintTotRows = lcobjResponse.promo.totrows;
						lcstrHtml += "<div class='ui-corner-all custom-corners'>";
						lcstrHtml += "<div class='ui-bar ui-bar-a'>";
						lcstrHtml += "<h3>" + lcobjResponse.promo.title + " - " + lcintTotRows + " resultados - Página " + (lcintPage + 1) + " de " + (parseInt(lcintTotRows / 20) + 1) + "</h3>";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='ui-body ui-body-a'>";
						if (lcintPage > 0)
							lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='PreviousPromoPage();'>Anteriores resultados</button>";
						for (lcintI = 0; lcintI < lcobjResponse.promo.data.length; lcintI++) {
							lcstrHtml += "<div class='nd2-card card-media-right card-media-small'>";
							lcstrHtml += "<div class='card-media'>";
							if ("" + lcobjResponse.promo.data[lcintI].profoto != "")
								lcstrHtml += "<img src='" + lcobjResponse.promo.data[lcintI].profoto + "' />";
							else
								lcstrHtml += "<img src='images/noimage.jpg' />";
							lcstrHtml += "</div>";
							lcstrHtml += "<div class='card-title has-supporting-text'>";
							lcstrHtml += "<h5 class='card-subtitle'><b>" + lcobjResponse.promo.data[lcintI].pronombre + "</b></h5>";
							lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.promo.data[lcintI].proean + "</h5>";
							lcstrHtml += "<h5 class='card-subtitle'><strike>$" + (lcobjResponse.promo.data[lcintI].prevalor).formatMoney(0, ',', '.') + "</strike>&nbsp;<font color='red'>$" + (lcobjResponse.promo.data[lcintI].prevalorpromo).formatMoney(0, ',', '.') + "</font> (" + lcobjResponse.promo.data[lcintI].usualias + ")</h5>";
							lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.promo.data[lcintI].prefecha + "<br />" + lcobjResponse.promo.data[lcintI].sucnombre + "</h5>";	
							lcstrHtml += "<div class='card-action'>";
							lcstrHtml += "<div class='row between-xs'>";
							lcstrHtml += "<div class='col-xs-4'>";
							lcstrHtml += "<div class='box'>";
							if (lcobjResponse.promo.data[lcintI].sucdistancia > 0.0)
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button' onclick='GetPricexLocation(" + lcobjResponse.promo.data[lcintI].preid + ");'><i class='fa fa-map-marker' style='cursor: pointer;'></i></a>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "<div class='col-xs-8 align-right'>";
							lcstrHtml += "<div class='box'>";
							if (lcobjResponse.promo.data[lcintI].sucdistancia >= 0.0)
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>" + (lcobjResponse.promo.data[lcintI].sucdistancia).formatMoney(0, ',', '.') + " metros</a>";
							else
								lcstrHtml += "<a href='#' class='ui-btn ui-btn-inline'>WEB</a>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
							lcstrHtml += "</div>";
						}
						if (lcintRows == 20)
							lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='NextPromoPage();'>Siguientes resultados</button>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					pvstrBack[0] = lcstrHtml;
					if (pvintNivel == 0) {
						document.getElementById("divContent").innerHTML = lcstrHtml;
						if (document.getElementById("ulBest50"))
							$('#ulBest50').listview().listview('refresh');
						$('[type="button"]').button().button('refresh');
					}
				}
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (StartupData)");
	}
}

function TakePicture() {
    var lcobjOptions = GetPictureOptions();

	try {
		navigator.camera.getPicture(
			function cameraSuccess(vlobjImageUri) {
				UploadPicture(vlobjImageUri);
			}, 
			function cameraError(error) {
				MsgBox("No fu&eacute; posible tomar la foto. Error: " + error);
			}, 
			lcobjOptions
		);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (TakePicture)");
	}
}

function TutorialPage() {
	var lcstrHtml = "";
	
	try {
		if (!pvbooStartup) pvintNivel = 1;
		lcstrHtml += "<div class='ui-corner-all custom-corners'>";
		lcstrHtml += "<div class='ui-bar ui-bar-a'>";
		lcstrHtml += "<h3>Tutorial</h3>";
		lcstrHtml += "</div>";
		lcstrHtml += "<div class='ui-body ui-body-a'>";
		lcstrHtml += "<table style=\"width: 100%; height: 80%; font-family: 'Roboto', sans-serif;\">";
		lcstrHtml += "<tr style='height: 100%'>";
		lcstrHtml += "<td id='tdTutPrev' align='center' style='width: 10%'><i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i></td>";
		lcstrHtml += "<td id='tdTutText' align='center' style='width: 80%'>";
		lcstrHtml += "<h3>Ahorra es una aplicación que te permite encontrar y comparar los precios de muchos productos en diferentes establecimientos y así tomar una decisión de compra inteligente.</h3>";
		lcstrHtml += "</td>";
		lcstrHtml += "<td id='tdTutNext' align='center' style='width: 10%'><i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i></td>";
		lcstrHtml += "</tr>";
		lcstrHtml += "<tr style='height: 50px'>";
		lcstrHtml += "<td colspan='3' align='center' style='width: 100%'>";
		lcstrHtml += "<i id='i1' class='fa fa-circle' onclick='SetTutorialPage(1, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i2' class='fa fa-circle-o' onclick='SetTutorialPage(2, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i3' class='fa fa-circle-o' onclick='SetTutorialPage(3, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i4' class='fa fa-circle-o' onclick='SetTutorialPage(4, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i5' class='fa fa-circle-o' onclick='SetTutorialPage(5, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i6' class='fa fa-circle-o' onclick='SetTutorialPage(6, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i7' class='fa fa-circle-o' onclick='SetTutorialPage(7, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i8' class='fa fa-circle-o' onclick='SetTutorialPage(8, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i9' class='fa fa-circle-o' onclick='SetTutorialPage(9, 0);'></i>&nbsp;";
		lcstrHtml += "<i id='i10' class='fa fa-circle-o' onclick='SetTutorialPage(10, 0);'></i>";
		lcstrHtml += "</td>";
		lcstrHtml += "</tr>";
		lcstrHtml += "</table>";
		lcstrHtml += "</div>";
		lcstrHtml += "</div>";
		document.getElementById("divContent").innerHTML = lcstrHtml;
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (TutorialPage)");
	}
}
			
function UpdateUser() {
	var lcstrError = "";
	
	try {
		if ("" + document.getElementById("txtAlias").value != "" && lcstrError == "") {
			if (!ValidateInput("" + document.getElementById("txtAlias").value))
				lcstrError = "El campo Seud&oacute;nimo solo puede contener letras, n&uacute;meros o _.";
		}
		if (lcstrError == "") {
			SetStorage("AH_DISTANCIAMAX", "" + document.getElementById("txtDistancia").value);
			pvintDistanciaMax = parseInt("" + document.getElementById("txtDistancia").value);
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=UPDATEUSER&ALIAS=" + window.btoa("" + document.getElementById("txtAlias").value) + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = UpdateUserData;
				pvobjRequest.send(null);
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			}
		}
		else
			MsgBox(lcstrError);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (UpdateUser)");
	}
}

function UpdateUserData() {
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					if (pvstrDeviceID != "")
						lcstrHtml += "<h3>Preferencias del usuario<br />[" + pvstrDeviceID + "]<br />Versi&oacute;n: " + pvstrVersion + "</h3>";
					else
						lcstrHtml += "<h3>Preferencias del usuario<br />[***** DEVICEID ERROR *****]<br />Versi&oacute;n: " + pvstrVersion + "</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<ul id='ulOpciones' data-role='listview' data-inset='true'>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtEmail'>Email:</label>";
					lcstrHtml += "<input type='email' name='txtEmail' id='txtEmail' value='" + lcobjResponse.email + "' data-clear-btn='true' placeholder='Email del usuario' disabled='disabled' />";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtAlias'>Seud&oacute;nimo:</label>";
					lcstrHtml += "<input type='text' name='txtAlias' id='txtAlias' value='" + lcobjResponse.alias + "' maxlength='15' data-clear-btn='true' placeholder='Seud&oacute;nimo' />";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<label for='txtDistancia'>Distancia máxima a buscar (Km):</label>";
					lcstrHtml += "<input type='number' data-type='range' name='txtDistancia' id='txtDistancia' value='" + pvintDistanciaMax + "' min='1' max='50' step='1' data-highlight='true'>";
					lcstrHtml += "</li>";
					lcstrHtml += "<li class='ui-field-contain'>";
					lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='UpdateUser();'>Guardar</button>";
					lcstrHtml += "</li>";
					lcstrHtml += "</ul>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					//lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
					document.getElementById("divContent").innerHTML = lcstrHtml;
					$('#ulOpciones').listview().listview('refresh');
					$('[type="text"]').textinput().textinput('refresh');
					$('[type="email"]').textinput().textinput('refresh');
					$('[type="button"]').button().button('refresh');
					$('[type="number"]').slider().slider('refresh');
				}
				else
					ShowMessage("Preferencias del usuario", lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (UpdateUserData)");
	}
}

function UploadPicture(vlobjImageUri) {
	try {
		window.resolveLocalFileSystemURL(
			vlobjImageUri, 
			function success(fileEntry) {
				//console.log("filefullpath: " + fileEntry.fullPath);
				//console.log("filenativeurl: " + fileEntry.nativeURL);
				var lcobjOptions = new FileUploadOptions();
				lcobjOptions.fileKey = "uploaded_file";
				lcobjOptions.fileName = pvproEAN + ".jpg";
				lcobjOptions.mimeType = "image/jpeg";
				var lcobjFileTransfer = new FileTransfer();
				lcobjFileTransfer.upload(
					fileEntry.nativeURL, 
					encodeURI("http://www.brainatoms.com/ahorra/tran.php?CMD=FILEUPLOAD&PROID=" + pvproID + "&PROEAN=" + pvproEAN + "&uploaded_file=" + pvproEAN + ".png&filename=" + pvproEAN + ".png&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random()), 
					function(r) {
						var lcobjResponse = JSON.parse(r.response);
						if (lcobjResponse.errcode == 0) {
							if (document.getElementById("imgFoto"))
								document.getElementById("imgFoto").src = lcobjResponse.url;
							if (document.getElementById("lblFotoCredito"))
								document.getElementById("lblFotoCredito").innerHTML = "";
							if (document.getElementById("lblAliasUsuario"))
								document.getElementById("lblAliasUsuario").innerHTML = "";
						}
						MsgBox(lcobjResponse.error);
					}, 
					function(error) {
						MsgBox(error);
					},
					lcobjOptions
				);
			}, 
			function () {}
		);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Search)");
	}
}
			
function ValidateEmail(vlstrEmail) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(vlstrEmail);
}
			
function ValidateInput(vlstrInput) {
	var re = /^[0-9a-zA-Z\_]+$/;
	return re.test(vlstrInput);
}

function ValidatePrice(vlintPreID, vlintValoracion) {
	var lcstrRequest = "";
	
	try {
		pvpreID = "" + vlintPreID;
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=VALIDATEPRECIO&PREID=" + vlintPreID + "&VALORACION=" + vlintValoracion + "&ACCOUNT=" + pvstrAccount + "&DEVICEID=" + pvstrDeviceID + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = ValidatePriceData;
			pvobjRequest.send(null);
			document.getElementById("lblValoracion" + pvpreID).innerHTML = "<img src='css/themes/default/images/ajax-loader.gif' style='height: 20px' />";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ValidatePrice)");
	}
}

function ValidatePriceData() {
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				document.getElementById("lblValoracion" + pvpreID).innerHTML = "" + lcobjResponse.prevaloracion;
				MsgBox(lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ValidatePriceData)");
	}
}
