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

var pvintPage = 0;
var pvintTutorialPage = 1;
var pvintPage = 0;
var pvintNivel = 0;
var pvintDistanciaMax = 5;
var pvdblLatitud = 6.2126324;
var pvdblLongitud = -75.5800677;
var pvstrVersion = "1.0";
var pvstrAccount = "";
var pvstrFunction = "";
var pvstrCommand = "";
var pvstrSearchData = "";
var pvstrBack = ["", "", ""];
var pvproNombre = "";
var pvproID = "";
var pvproEAN = "";
var pvproFoto = "";
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
		var lcstrVersion = GetStorage("AH_VERSION", "");
		pvstrAccount = "" + device.uuid;
		pvintDistanciaMax = parseInt(GetStorage("AH_DISTANCIAMAX", "1"));
		pvstrBack[0] = "" + document.getElementById("divContent").innerHTML;
		if (AdMob) AdMob.prepareInterstitial( { adId:admobid.interstitial, autoShow:true } );
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
		if (pvstrVersion != lcstrVersion)
			setTimeout(ShowTerms, 100);
		else {
			if (AdMob) AdMob.prepareInterstitial( { adId:admobid.interstitial, autoShow:true } );
		}
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

function Back() {
	try {
		if (pvintNivel > 0)
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
			SetTutorialPage(pvintTutorialPage, 0);
			document.getElementById("txtBuscar").value = "";
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (BarCodeData)");
	}
}

function ContributePrice(vlproID) {
	var lcstrError = "";
	
	try {
		if ("" + document.getElementById("txtUbicacion").value == "" && "" + document.getElementById("txtNuevaUbicacion").value == "" && lcstrError == "")
			lcstrError = "El campo Ubicaci&oacute;n o Nueva Ubicaci&oacute;n es requerido.";
		if ("" + document.getElementById("txtPrecio").value == "" && lcstrError == "")
			lcstrError = "El campo Precio es requerido.";
		if (lcstrError == "") {
			pvobjRequest = getXmlHttpRequestObject();
			if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
				document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
				lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=CONTRIBUTE2&ID=" + vlproID + "&Ubicacion=" + document.getElementById("txtUbicacion").value + "&NuevaUbicacion=" + window.btoa("" + document.getElementById("txtNuevaUbicacion").value) + "&Precio=" + document.getElementById("txtPrecio").value + "&ACCOUNT=" + pvstrAccount + "&PID=" + Math.random();
				console.log(">> " + lcstrRequest);
				pvobjRequest.open("GET", lcstrRequest, true);
				pvobjRequest.onreadystatechange = ContributePriceData;
				pvobjRequest.send(null);
			}
		}
		else
			MsgBox(lcstrError);
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ContributePrice)");
	}
}

function ContributePriceData(vlstrResponse) {
	var lcintI = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>Contribuir</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<p>Gracias por su ayuda. Se ha agregado el nuevo precio para el producto seleccionado.</p>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
				else {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>Contribuir</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<p>" + lcobjResponse.error + "</p>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ContributePriceData)");
	}
}

function GetBarCodeData(vlstrResponse) {
	var lcintI = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++) {
						lcstrHtml += "<div class='nd2-card card-media-right card-media-small'>";
						lcstrHtml += "<div class='card-media'>";
						if ("" + lcobjResponse.data[lcintI].profoto != "")
							lcstrHtml += "<img src='" + lcobjResponse.data[lcintI].profoto + "' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "');\" />";
						else
							lcstrHtml += "<img src='img/noimage.jpg' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "');\" />";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='card-title has-supporting-text'>";
						lcstrHtml += "<h5 class='card-subtitle'><b>" + lcobjResponse.data[lcintI].pronombre + "</b></h5>";
						lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].proean + "</h5><br />";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-raised ui-btn-inline waves-effect waves-button waves-effect waves-button' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "');\">CONSULTAR PRECIOS</a>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					pvintNivel = 1;
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
							lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
						}
					}
					pvintNivel = 1;
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
		lcstrHtml += "<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />";
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetContributeText)");
	}
	
	return lcstrHtml;
}

function GetOptions() {
	var lcstrHtml = "";
	
	try {
		console.log("getoptions");
		lcstrHtml += "<div class='ui-corner-all custom-corners'>";
		lcstrHtml += "<div class='ui-bar ui-bar-a'>";
		lcstrHtml += "<h3>Opciones</h3>";
		lcstrHtml += "</div>";
		lcstrHtml += "<div class='ui-body ui-body-a'>";
		lcstrHtml += "<ul id='ulOpciones' data-role='listview' data-inset='true'>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<label for='txtEmail'>ID:</label>";
		lcstrHtml += "<input type='text' name='txtEmail' id='txtEmail' value='" + pvstrAccount + "' data-clear-btn='true' placeholder='Email del usuario' disabled='disabled' />";
		lcstrHtml += "</li>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<label for='txtDistancia'>Distancia m&aacute;xima a buscar (Km):</label>";
		lcstrHtml += "<input type='number' data-type='range' name='txtDistancia' id='txtDistancia' value='" + pvintDistanciaMax + "' min='1' max='50' step='1' data-highlight='true'>";
		lcstrHtml += "</li>";
		lcstrHtml += "<li class='ui-field-contain'>";
		lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='SaveOptions();'>Guardar</button>";
		lcstrHtml += "</li>";
		lcstrHtml += "</ul>";
		lcstrHtml += "</div>";
		lcstrHtml += "</div>";
		document.getElementById("divContent").innerHTML = lcstrHtml;
		$('#ulOpciones').listview().listview('refresh');
		$('[type="text"]').textinput().textinput('refresh');
		$('[type="button"]').button().button('refresh');
		$('[type="number"]').slider().slider('refresh');
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetOptions)");
		alert(ee.message);
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
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return lcobjOptions;
}

function GetPrices(vlintProductID, vlstrProductName, vlstrProductPhoto, vlstrProductEAN) {
	try {		
		pvproID = vlintProductID;
		pvproNombre = vlstrProductName;
		pvproEAN = vlstrProductEAN;
		if (vlstrProductPhoto != "") {
			lcintPos = vlstrProductPhoto.indexOf("://");
			if (lcintPos >= 0) {
				lcstrCredito = vlstrProductPhoto.substr(lcintPos + 3);
				lcintPos = lcstrCredito.indexOf("/");
				if (lcintPos >= 0)
					lcstrCredito = lcstrCredito.substr(0, lcintPos);
				lcstrCredito = lcstrCredito.replace("www.", "").replace("WWW.", "");
				pvproFoto = "<p align='center'><img src='" + vlstrProductPhoto + "' style='height: 200px' /><br />" + vlstrProductEAN + "<br />Foto: " + lcstrCredito + "</p>";
			}
			else
				pvproFoto = "<p align='center'><img src='" + vlstrProductPhoto + "' style='height: 200px' /><br />" + vlstrProductEAN + "</p>";
		}
		else
			pvproFoto = "<p align='center'><img src='img/noimage.jpg' style='cursor: pointer; height: 200px' onclick='TakePicture();' /><br />" + vlstrProductEAN + "</p>";
		
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRECIOS&PROID=" + vlintProductID + "&ACCOUNT=" + pvstrAccount + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = GetPricesData;
			pvobjRequest.send(null);
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (Search)");
	}
}

function GetPricesData(vlstrResponse) {
	var lcbooAddFooter = true;
	var lcintI = 0;
	var lcstrHtml = "";
	var lcstrPrevSuc = "";
	
	try {
		pvintNivel = 2;
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				if (lcobjResponse.errcode == 0) {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>" + lcobjResponse.pronombre + "</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div id='divFoto' class='ui-body ui-body-a'>";
					if (pvproFoto != "")
						lcstrHtml += pvproFoto;
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					
					for (lcintI = 0; lcintI < lcobjResponse.data.length; lcintI++) {
						if (lcstrPrevSuc != "" + lcobjResponse.data[lcintI].sucid) {
							lcstrHtml += "<div class='nd2-card'>";
							lcstrHtml += "<div class='card-title has-supporting-text'>";
						}
						if ("" + lcobjResponse.data[lcintI].prevalorpromo != "0")
							lcstrHtml += "<h3 class='card-primary-title'><strike>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + "</strike>&nbsp;<font color='red'>$" + (lcobjResponse.data[lcintI].prevalorpromo).formatMoney(0, ',', '.') + "</font> (" + lcobjResponse.data[lcintI].usualias + ")&nbsp;&nbsp;<i class='fa fa-check' title='Es precio es correcto.' style='cursor: pointer;' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 1);'></i>&nbsp;&nbsp;(<span id='lblValoracion'>" + lcobjResponse.data[lcintI].prevaloracion + "</span>)&nbsp;&nbsp;<i class='fa fa-times' style='cursor: pointer;' title='Es precio NO es correcto.' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 0);'></i></h3>";
						else
							lcstrHtml += "<h3 class='card-primary-title'>$" + (lcobjResponse.data[lcintI].prevalor).formatMoney(0, ',', '.') + " (" + lcobjResponse.data[lcintI].usualias + ")&nbsp;&nbsp;<i class='fa fa-check' style='cursor: pointer;' title='Es precio es correcto.' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 1);'></i>&nbsp;&nbsp;(<span id='lblValoracion'>" + lcobjResponse.data[lcintI].prevaloracion + "</span>)&nbsp;&nbsp;<i class='fa fa-times' title='Es precio NO es correcto.' style='cursor: pointer;' onclick='ValidatePrice(" + lcobjResponse.data[lcintI].preid + ", 0);'></i></h3>";
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
					}
					lcstrHtml += GetContributeText(lcobjResponse);
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
				else {
					if (pvproFoto != "" && pvproNombre != "") {							
						lcstrHtml += "<div class='ui-corner-all custom-corners'>";
						lcstrHtml += "<div class='ui-bar ui-bar-a'>";
						lcstrHtml += "<h3>" + pvproNombre + "</h3>";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='ui-body ui-body-a'>";
						lcstrHtml += "<p align='center'>" + pvproFoto + "</p>";
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
}

function GetPricexLocation(vlintPreID) {
	try {
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRECIOXUBICACION&PREID=" + vlintPreID + "&ACCOUNT=" + pvstrAccount + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = GetPricexLocationData;
			pvobjRequest.send(null);
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (GetPricexLocation)");
	}
}

function GetPricexLocationData(vlstrResponse) {
	var lcintI = 0;
	var lcstrHtml = "";
	
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
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

function GetUserLocation(position) {
	try {
		pvdblLatitud = position.coords.latitude; 
		pvdblLongitud = position.coords.longitude;
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
	try {
		switch (pvstrCommand) {
			case "GETPRODUCTOS":
				pvintPage++;
				pvobjRequest = getXmlHttpRequestObject();
				if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
					document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
					lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRODUCTOS&PAGE=" + pvintPage + "&PRO=" + window.btoa(pvstrSearchData) + "&ACCOUNT=" + pvstrAccount + "&PID=" + Math.random();
					console.log(">> " + lcstrRequest);
					pvobjRequest.open("GET", lcstrRequest, true);
					pvobjRequest.onreadystatechange = SearchData;
					pvobjRequest.send(null);
				}
				break;
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (NextPage)");
	}
}

function PreviousPage() {
	try {
		switch (pvstrCommand) {
			case "GETPRODUCTOS":
				if (pvintPage > 0) {
					pvintPage--;
					pvobjRequest = getXmlHttpRequestObject();
					if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
						document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
						lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRODUCTOS&PAGE=" + pvintPage + "&PRO=" + window.btoa(pvstrSearchData) + "&ACCOUNT=" + pvstrAccount + "&PID=" + Math.random();
						console.log(">> " + lcstrRequest);
						pvobjRequest.open("GET", lcstrRequest, true);
						pvobjRequest.onreadystatechange = SearchData;
						pvobjRequest.send(null);
					}
				}
				break;
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (PreviousPage)");
	}
}

function SaveOptions() {
	var lcstrError = "";
	
	try {
		if ("" + document.getElementById("txtEmail").value == "" && lcstrError == "")
			MsgBox("Email es requerido.");
		else {
			SetStorage("AH_EMAIL", "" + document.getElementById("txtEmail").value);
			pvstrAccount = "" + document.getElementById("txtEmail").value;
			SetStorage("AH_DISTANCIAMAX", "" + document.getElementById("txtDistancia").value);
			pvintDistanciaMax = parseInt("" + document.getElementById("txtDistancia").value);
			MsgBox("La informaci&oacute;n ha sido guardada exitosamente.");
			pvintNivel = 1;
			setTimeout(Back, 100);
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (SaveOptions)");
	}
}

function Scan() {
	try {
		if (pvstrAccount != "") {
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					if (result.text != "") {
						pvobjRequest = getXmlHttpRequestObject();
						if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
							document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
							lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETCODIGO&PRO=" + result.text + "&LAT=" + pvdblLatitud + "&LON=" + pvdblLongitud + "&MAX=" + (pvintDistanciaMax * 1000) + "&ACCOUNT=" + pvstrAccount + "&PID=" + Math.random();
							console.log(">> " + lcstrRequest);
							pvobjRequest.open("GET", lcstrRequest, true);
							pvobjRequest.onreadystatechange = GetBarCodeData;
							pvobjRequest.send(null);
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
					torchOn: true, // Android, launch with the torch switched on (if available)
					prompt : "Posicione el c&oacute;digo de barras dentro del area", // Android
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
			setTimeout(GetOptions, 100);
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
			if (pvstrAccount != "") {
				if (("" + document.getElementById("txtBuscar").value).length >= 3) {
					pvintPage = 0;
					pvstrCommand = "GETPRODUCTOS";
					pvstrSearchData = "" + document.getElementById("txtBuscar").value;
					pvobjRequest = getXmlHttpRequestObject();
					if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
						document.getElementById("divContent").innerHTML = "<br /><br /><center><img src='css/themes/default/images/ajax-loader.gif' /></center>";
						lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=GETPRODUCTOS&PAGE=0&PRO=" + window.btoa("" + document.getElementById("txtBuscar").value) + "&ACCOUNT=" + pvstrAccount + "&PID=" + Math.random();
						console.log(">> " + lcstrRequest);
						pvobjRequest.open("GET", lcstrRequest, true);
						pvobjRequest.onreadystatechange = SearchData;
						pvobjRequest.send(null);
					}
				}
				else
					alert("Debe ingresar por lo menos 3 letras del producto.");
			}
			else {
				MsgBox("Para poder ejecutar esta acci&oacute;n debe registrase primero.");
				setTimeout(GetOptions, 100);
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
							lcstrHtml += "<img src='" + lcobjResponse.data[lcintI].profoto + "' style='cursor: pointer' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "');\" />";
						else
							lcstrHtml += "<img src='img/noimage.jpg' style='cursor: pointer' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "');\" />";
						lcstrHtml += "</div>";
						lcstrHtml += "<div class='card-title has-supporting-text'>";
						lcstrHtml += "<h5 class='card-subtitle'><b>" + lcobjResponse.data[lcintI].pronombre + "</b></h5>";
						lcstrHtml += "<h5 class='card-subtitle'>" + lcobjResponse.data[lcintI].proean + "</h5><br />";
						lcstrHtml += "<a href='#' class='ui-btn ui-btn-raised ui-btn-inline waves-effect waves-button waves-effect waves-button' onclick=\"GetPrices(" + lcobjResponse.data[lcintI].proid + ", '" + lcobjResponse.data[lcintI].pronombre + "', '" + lcobjResponse.data[lcintI].profoto + "', '" + lcobjResponse.data[lcintI].proean + "');\">CONSULTAR PRECIOS</a>";
						lcstrHtml += "</div>";
						lcstrHtml += "</div>";
					}
					if (lcintRows == 20)
						lcstrHtml += "<button class='ui-btn ui-corner-all ui-btn-a ui-btn-raised' onclick='NextPage();'>Siguientes resultados</button>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					pvintNivel = 1;
					pvstrBack[pvintNivel] = lcstrHtml;
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
				else {
					lcstrHtml += "<div class='ui-corner-all custom-corners'>";
					lcstrHtml += "<div class='ui-bar ui-bar-a'>";
					lcstrHtml += "<h3>Busqueda de precios</h3>";
					lcstrHtml += "</div>";
					lcstrHtml += "<div class='ui-body ui-body-a'>";
					lcstrHtml += "<p>" + lcobjResponse.error + "</p>";
					lcstrHtml += "</div>";
					lcstrHtml += "</div>";
					document.getElementById("divContent").innerHTML = lcstrHtml;
				}
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
				if (pvintTutorialPage == 8)
					pvintTutorialPage = 1;
				else
					pvintTutorialPage++;
			}
			else {
				if (pvintTutorialPage == 1)
					pvintTutorialPage = 8;
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
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Haga click en <i class='fa fa-cog'></i> y configure la distancia m&aacute;xima de b&uacute;squeda de productos desde su ubicaci&oacute;n.</h3>";
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
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Escane&eacute; el c&oacute;digo de barras del producto haciendo click en <i class='fa fa-barcode'></i> o busque por nombre del producto y consulte los precios que ha ingresado nuestra comunidad de usuarios.</h3>";
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
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Se desplegar&aacute;n los precios del producto en los establecimientos cercanos a usted, seg&uacute;n la configuraci&oacute;n realizada en <i class='fa fa-cog'></i>.</h3>";
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
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Puede contribuir con la comunidad haciendo click en <i class='fa fa-check'></i> si el precio es correcto o en <i class='fa fa-times'></i> si no lo es, para el producto del establecimiento en el que se encuentra.</i></h3>";
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
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Si no existe ning&uacute;n precio registrado para el producto en el establecimiento o si &eacute;ste no coindice, puede ayudarnos registr&aacute;ndolo y as&iacute; ayudando a que otros usuarios encuentren el mejor precio.</h3>";
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
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Si el establecimiento en el que se encuentra no aparece en la lista desplegable UBICACI&Oacute;N, puede registrarlo en el campo NUEVA UBICACI&Oacute;N.</h3>";
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
				document.getElementById("tdTutPrev").innerHTML = "<i class='fa fa-chevron-left fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 2);'></i>";
				document.getElementById("tdTutNext").innerHTML = "<i class='fa fa-chevron-right fa-2x' style='cursor: pointer;' onclick='SetTutorialPage(0, 1);'></i>";
				lcstrHtml += "<h3>Haga click en <i class='fa fa-map-marker'></i> para conocer la ubicaci&oacute;n del establecimiento con el precio deseado.</h3>";
				document.getElementById("tdTutText").innerHTML = lcstrHtml;
				break;
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (SetTutorialPage)");
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
				if (button == 1)
					SetStorage("AH_VERSION", pvstrVersion);
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
					encodeURI("http://www.brainatoms.com/ahorra/tran.php?CMD=FILEUPLOAD&PROID=" + pvproID + "&PROEAN=" + pvproEAN + "&uploaded_file=" + pvproEAN + ".png&filename=" + pvproEAN + ".png&ACCOUNT=" + pvstrAccount + "&PID=" + Math.random()), 
					function(r) {
						var lcobjResponse = JSON.parse(r.response);
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

function ValidatePrice(vlintPreID, vlintValoracion) {
	try {
		pvobjRequest = getXmlHttpRequestObject();
		if (pvobjRequest.readyState == 4 || pvobjRequest.readyState == 0) {
			document.getElementById("lblValoracion").innerHTML = "<img src='css/themes/default/images/ajax-loader.gif' style='height: 20px' />";
			lcstrRequest = "http://www.brainatoms.com/ahorra/tran.php?CMD=VALIDATEPRECIO&PREID=" + vlintPreID + "&VALORACION=" + vlintValoracion + "&ACCOUNT=" + pvstrAccount + "&PID=" + Math.random();
			console.log(">> " + lcstrRequest);
			pvobjRequest.open("GET", lcstrRequest, true);
			pvobjRequest.onreadystatechange = ValidatePriceData;
			pvobjRequest.send(null);
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ValidatePrice)");
	}
}

function ValidatePriceData(vlstrResponse) {
	try {
		if (pvobjRequest.readyState == 4) {
			if (pvobjRequest.status == 200) {
				var lcobjResponse = JSON.parse(pvobjRequest.responseText);
				document.getElementById("lblValoracion").innerHTML = "" + lcobjResponse.prevaloracion;
				MsgBox(lcobjResponse.error);
			}
		}
	}
	catch (ee) {
		MsgBox("Error: " + ee.message + " (ValidatePriceData)");
	}
}
