var sortCol;												// a t�bla ezen oszlop szerint van rendezve
var actTab;													// az aktu�lis "oldal" azonos�t�ja
var ext = new Array("pdf", "doc", "xls", "ppt", "cdr");		// a figyelt kiterjeszt�sek

// (�t)rendezz�k a t�bl�t
function sortTable(column) {
	// megkeress�k a t�bl�t, amin dolgoznunk kell
	var table = document.getElementById("sortable");

	// ha csak egy sora van, akkor nem foglalkozunk vele
	if (table.rows.length <= 1) return;						

	var actHead = table.tHead.rows[0].cells[Math.abs(sortCol) - 1];
	if (actHead) {
		actHead.className = actHead.className.replace((sortCol > 0) ? "asc" : "des", "");
	}

	// ha a jelenlegivel azonos oszlopra kattintott, akkor megford�tjuk a rendez�st
	sortCol = column * ((column == sortCol) ? -1 : 1);
	
	// kell egy t�mb, amibe kigy�jtj�k a teljes t�blatestet
	var newRows = new Array();
	
	// a t�mbbe bet�ltj�k az �sszes cella tartalm�t �s st�lus�t
	for (var r = 0; r < table.tBodies[0].rows.length; r++) {
		newRows[r] = new Array();
		for (var c = 0; c < table.tBodies[0].rows[r].cells.length; c++) {
			newRows[r][c] = new Object();
			newRows[r][c].value = table.tBodies[0].rows[r].cells[c].innerHTML;
			newRows[r][c].style = table.tBodies[0].rows[r].cells[c].className;
		}
	}

	// a t�mb�t lerendezz�k a sortFn f�ggv�ny seg�ts�g�vel
	newRows.sort(sortFn);
		
	// a t�mb tartalm�t vissza�rjuk a t�blatestbe
	for (var r = 0; r < table.tBodies[0].rows.length; r++) {
		for (var c = 0; c < table.tBodies[0].rows[r].cells.length; c++) {
			table.tBodies[0].rows[r].cells[c].innerHTML = newRows[r][c].value;
			table.tBodies[0].rows[r].cells[c].className = newRows[r][c].style;
		}
	}
		
	var newHead = table.tHead.rows[0].cells[Math.abs(sortCol) - 1];
	newHead.className += (sortCol > 0) ? " asc" : " des";
	newHead.firstChild.blur();
}

// egy kis seg�ts�g a sort() met�dusnak
function sortFn(a, b) {
	if (Math.abs(sortCol) != 4) {
		var aa = removeAccents(a[Math.abs(sortCol) - 1].value.toLowerCase());
		var bb = removeAccents(b[Math.abs(sortCol) - 1].value.toLowerCase());
	} else {
		var aa = removeAccents(a[3].value.substr(a[3].value.indexOf(">") + 2, 99));
		var bb = removeAccents(b[3].value.substr(b[3].value.indexOf(">") + 2, 99));
	}

	if (aa == bb)
		return 0;
	else
		return ((aa < bb) ? -1 : 1) * ((sortCol < 0) ? -1: 1);
}

function removeAccents(str) {
	// a rendez�skor az �kezetes bet�k zavar�ak, ez�rt elt�ntetj�k az �kezeteket
	str = str.replace(/�/g, "a"); str = str.replace(/�/g, "e"); str = str.replace(/�/g, "i");
	str = str.replace(/�/g, "o"); str = str.replace(/�/g, "o"); str = str.replace(/�/g, "o");
	str = str.replace(/�/g, "u"); str = str.replace(/�/g, "u"); str = str.replace(/�/g, "u");
	
	str = str.replace(/�/g, "A"); str = str.replace(/�/g, "E"); str = str.replace(/�/g, "I");
	str = str.replace(/�/g, "O"); str = str.replace(/�/g, "O"); str = str.replace(/�/g, "O");
	str = str.replace(/�/g, "U"); str = str.replace(/�/g, "U"); str = str.replace(/�/g, "U");

	return str;
}

// a "f�lek" megjelen�t�se/elt�ntet�se
function showTab(tab) {
	var tabNum = tab.id.replace("_tab", "");
	
	if (actTab != tabNum) {														// ha nem az aktu�lis f�lre kattintott
		actTabDiv = document.getElementById("_head" + actTab).parentNode;		// elt�ntetj�k az aktu�lis f�l tartalm�t
		actTabDiv.style.display = "none";
		actTabLi = document.getElementById("_tab" + actTab)						// az aktu�lis f�l LI eleme
		actTabLi.className = actTabLi.className.replace("selected", "");		// m�r nem aktu�lis listaelem

		actTab = tabNum;														// mostant�l ez lesz az aktu�lis f�l

		actTabDiv = document.getElementById("_head" + actTab).parentNode;
		actTabDiv.style.display = "block";
		document.getElementById("_tab" + actTab).className += " selected";		// az aktu�lis f�lnek m�s a sz�ne
	}
	
	tab.childNodes[0].blur();													// eldobjuk a kijel�l�s keret�t
}

// a sz�vegb�l elt�vol�tjuk a f�jlnevekben nem haszn�lhat� karaktereket
function text2file(text) {
	var remove = '.,:;|/*?<>"';

	text = removeAccents(text.toLowerCase());		// kisbet�ss� alak�tjuk, �s elt�vol�tjuk az �kezeteket
	text = text.replace(/\s/g, "_");				// a sz�k�z�ket al�h�z�saokk� alak�tjuk
	var file = "";									// elt�vol�tjuk a nemk�v�natos karaktereket
	for (c = 0; c < text.length; c++) {
		file += (remove.indexOf(text.substr(c, 1)) == -1 && text.substr(c, 1) != "\\") ? text.substr(c, 1) : "";
	}
	
	return file;	
}

// a c�msorok k�peinek kezel�se
function loadHeadImg(headImg) {
	headImg.alt = "";					// ha bet�lt�d�tt a k�p, nem kell ALT neki
}

function errorHeadImg(headImg) {
	// valami hiba t�rt�nt
	var head = headImg.parentNode;		// ebben a c�msorban vagyunk
	if (head) {							// az IE egyszer sz�l� n�lk�l is hib�t ad
		head.removeChild(headImg);		// elt�vol�tjuk a k�pet
		head.innerHTML = headImg.alt;	// vissza�rjuk az eredeti sz�veget
		headImg = null;					// a mem�ri�b�l t�r�lj�k a k�pobjektumot
	}
}

// inicializ�ljuk az oldalt
function initPage() {
	// az �sszes linket �tn�zz�k �s be�ll�tjuk 
	var links = document.getElementsByTagName("a");
	
	for (var l = 0; l < links.length; l++) {
		if (links[l].hostname != location.hostname) {
			links[l].target = "_blank";
			links[l].className += " out";
		}

		for (e in ext) {
			if (RegExp(eval("/\." + ext[e] + "$/i")).test(links[l].href))
				links[l].className += " " + ext[e];
		}
		
		if (RegExp(/#$/).test(links[l].href))
			links[l].onclick = function() { return false; }
	}

	// v�gign�zz�k az �sszes t�bl�t 
	var tables = document.getElementsByTagName("table");
	
	for (var t = 0; t < tables.length; t++) {
		if (tables[t].className.indexOf("zebra") > -1) {
			// becs�kozzuk a t�bl�t
			for (var b = 0; b < tables[t].tBodies.length; b++) {
				for (var r = 0; r < tables[t].tBodies[0].rows.length; r++) {
					// a p�ros sorok "even", a p�ratlanaok "odd" st�lust kapnak
					tables[t].tBodies[0].rows[r].className += (r % 2 == 0) ? " even" : " odd";
					
					// kiv�ltjuk a tr:hover-t k�t egyszer� f�ggv�nnyel
					tables[t].tBodies[0].rows[r].onmouseover = function() { this.className += " activerow"; }
					tables[t].tBodies[0].rows[r].onmouseout  = function() { this.className = this.className.replace("activerow", ""); }
				}
			}
		}
					
		if (tables[t].id == "sortable") {
			// a fejl�cre linkeket helyez�nk a rendez�shez
			for (var c = 0; c < tables[t].tHead.rows[0].cells.length; c++) {
				// l�trehozunk egy �j linket
				var newLink = document.createElement("a");
				newLink.href = "javascript:sortTable(" + (c + 1) + ")";
		
				// a linkhez hozz�adjuk a cella �sszes elem�t
				var children = tables[t].tHead.rows[0].cells[c].childNodes;
				for (var n = 0; n < children.length; n++) {
					newLink.appendChild(children[n]);
				}
				
				// az �j linket hozz�adjuk a cell�hoz
				tables[t].tHead.rows[0].cells[c].appendChild(newLink);
			}
		}
	}
	
	// van-e navig�tor div a lapon?
	var nav = document.getElementById("navigator");
	if (nav) {
		// l�trehozunk egy �j list�t
		var list = document.createElement("ul");
		
		var heads = document.getElementById("jobb_panel").getElementsByTagName("h2");
		for (h = 0; h < heads.length; h++) {
			heads[h].id = "_head" + h;											// azonos�t�t adunk a c�msornak
			
			var listelem = document.createElement("li");						// l�trehozunk egy �j LI elemet
			listelem.id = "_tab" + h;											// azonos�t�t adunk a linknek
			listelem.innerHTML = '<A href="#">' + heads[h].innerHTML + '</A>';	// kell egy link
			listelem.onclick   = function() { showTab(this); return false; }  	// amire ha kattintanak, v�ltson f�let
			list.appendChild(listelem);											// felf�zz�k a list�ra
			
			if (h == 0) {														// az els� a kiv�lasztott
				listelem.className = "selected";
			} else {
				tabDiv = heads[h].parentNode;									// az �sszes t�bbit elt�ntetj�k
				tabDiv.style.display = "none";
			}
		}
		nav.appendChild(list);													// a list�t beillesztj�k a DIV-be
		actTab = "0";															// az aktu�lis "f�l" a 0.
	}
	
	// a r�sztvev�k t�bl�j�ban az orsz�gnevek el� odatessz�k a z�szl�kat
	if (document.body.id == "resztvevok") {
		var table = document.getElementById("sortable");

		for (var r = 0; r < table.tBodies[0].rows.length; r++) {
			var county = table.tBodies[0].rows[r].cells[3].innerHTML;
			var cocode = "empty";
			
			for (var c = 0; c < country.length; c++) {
				if (country[c][1].toLowerCase() == county.toLowerCase()) {
					cocode = country[c][0].toLowerCase();
					break;
				}
			}
			table.tBodies[0].rows[r].cells[3].innerHTML = '<img src="images/flags/' + cocode + '.gif" alt=""/> ' + county;
		}
	}
		
	// cikkekhez tartalomjegyz�ket k�sz�t�nk
	if (document.body.id == "cikkek") {
		var toc = document.getElementById("tartalom");
		var art = document.getElementById("cikk");
		
		if (toc && art) {
			var tocList = document.createElement("ul");
			var tocLine = 0;
		
			// helyet csin�lunk a tartalomnak
			toc.style.width = "210px";
			toc.style.padding = "6px";
			art.style.width = "712px";
			art.style.marginLeft = "220px";
			
			var tocTitle = document.createElement("h1");
			tocTitle.innerHTML = "Tartalom";
			toc.appendChild(tocTitle);
			
			var elems = art.getElementsByTagName("*");
			for (e = 0; e < elems.length; e++) {
				var nodeName = elems[e].nodeName.toLowerCase();
				if (nodeName == "h1" || nodeName == "h2" || nodeName == "h3" || nodeName == "h4") {
					if (elems[e].id) {
						id = elems[e].id
					} else {
						id = "_toc" + ++tocLine;
						elems[e].id = id;
					}

					var tocElem = document.createElement("li");
					tocElem.innerHTML = '<a href="#' + id + '">' + elems[e].innerHTML + '</a>';
					tocElem.className = "toclevel" + nodeName.substr(1, 1);
					tocList.appendChild(tocElem);
				}
			}
			toc.appendChild(tocList);
		}
	}
	
	// cikkek c�msorainak sz�vegeit k�pekre cser�lj�k
	if (document.body.id == "cikkek" && document.body.className) {
		var art = document.getElementById("cikk");
		var imgPath = "images/heads/" + document.body.className + "/";
		
		if (art) {
			var h1s = art.getElementsByTagName("h1");
			var h2s = art.getElementsByTagName("h2");
			var h3s = art.getElementsByTagName("h3");
			
			for (var h = 0; h < h1s.length + h2s.length + h3s.length ; h++) {
				if (h < h1s.length)
					var head = h1s[h];
				else if (h < h1s.length + h2s.length)
					var head = h2s[h - h1s.length];
				else
					var head = h3s[h - h1s.length - h2s.length];
				
				var headImg = document.createElement("img");
				headImg.alt = head.innerHTML;
				headImg.onload  = function() { loadHeadImg(this); };
				headImg.onerror = function() { errorHeadImg(this); };
				headImg.src = imgPath + text2file(head.innerHTML) + ".gif";

				head.innerHTML = "";

				head.appendChild(headImg);
			}
		}
	}
}

window.onload = initPage;