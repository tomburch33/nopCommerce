var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml(string) {
  if (string == null) {
    return '';
  }
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

//selectedIds - This variable will be used on views. It can not be renamed
var selectedIds = [];


function clearMasterCheckbox(tableSelector) {
  var modelName = tableSelector.replace(/[#]/g, '');
  var selector = '#mastercheckbox_' + modelName;
  $(selector).prop('checked', false).change();
  selectedIds = [];
}


function updateMasterCheckbox(tableSelector) {
  var modelName = tableSelector.replace(/[#]/g, '');
  var selector = 'mastercheckbox_' + modelName;

  var numChkBoxes = $(tableSelector + ' input[type=checkbox][id!=' + selector + '][class=checkboxGroups]').length;
  var numChkBoxesChecked = $(tableSelector + ' input[type=checkbox][id!=' + selector + '][class= checkboxGroups]:checked').length;
  $('#mastercheckbox_' + modelName).prop('checked', numChkBoxes == numChkBoxesChecked && numChkBoxes > 0);
}


function updateTableSrc(tableSelector, isMasterCheckBoxUsed) {
  var dataSrc = $(tableSelector).DataTable().data();
  $(tableSelector).DataTable().clear().rows.add(dataSrc).draw();
  $(tableSelector).DataTable().columns.adjust();
  
  if (isMasterCheckBoxUsed) {
    clearMasterCheckbox(tableSelector);
  }
}


function updateTable(tableSelector, isMasterCheckBoxUsed) {
  $(tableSelector).DataTable().ajax.reload();
  $(tableSelector).DataTable().columns.adjust();

  if (isMasterCheckBoxUsed) {
    clearMasterCheckbox(tableSelector);
  }
}


function updateTableWidth(tableSelector) {
  if ($.fn.DataTable.isDataTable(tableSelector)) {
    $(tableSelector).DataTable().columns.adjust();
  }
}