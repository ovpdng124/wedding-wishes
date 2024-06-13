const API_GATEWAY_ENDPOINT = 'https://5al5s80f32.execute-api.ap-northeast-1.amazonaws.com/dev/wedding-wishes'
const COLOR_REJECT_BG = '#ffcfc9'
const COLOR_REJECT_FONT = '#b10202'
const COLOR_APPROVE_BG = '#d4edbc'
const COLOR_APPROVE_FONT = '#11734b'
const COLOR_ERROR_BG = '#ffe5a0'
const COLOR_ERROR_FONT = '#473821'
const COLOR_EMPTY_BG = '#e6e6e6'
const COLOR_EMPTY_FONT = '#3d3d3d'

function sendWishesOnEditStatus(e) {
  const sheet = e.source.getActiveSheet();
  const editedRange = e.range;
  const editedColumn = editedRange.getColumn();

  if (editedColumn === 4) { // Make sure the editedColumn must be D column
    const editedRow = editedRange.getRow();
    const valueInD = editedRange.getValue();
    const rowFocused = sheet.getRange(editedRow, 1, 1, editedColumn + 1)
    const statusRange = sheet.getRange(editedRow, editedColumn + 1)

    if (valueInD === 'Approve') {
      const nameValue = sheet.getRange(editedRow, 2).getValue();
      const contentValue = sheet.getRange(editedRow, 3).getValue();

      if (!nameValue || !contentValue) {
        sheet.getRange(editedRow, 5).setValue('Không có nội dung');
        setStatusColor(rowFocused, 'Empty')

        return;
      }

      const data = {
        name: nameValue,
        content: contentValue
      };

      const options = {
        method: 'post',
        payload: JSON.stringify(data),
        contentType: 'application/json',
        muteHttpExceptions: true
      };

      try {
        console.log('Chuẩn bị gửi')
        const response = UrlFetchApp.fetch(API_GATEWAY_ENDPOINT, options);
        console.log('Chuẩn bị lấy kết quả')
        const responseCode = response.getResponseCode();

        if (responseCode === 200) {
          statusRange.setValue('Đã gửi');

          setStatusColor(rowFocused, 'Approve')
        } else {
          statusRange.setValue('Lỗi khi gửi');
        }
      } catch (err) {
        statusRange.setValue('Lỗi khi gửi');

        setStatusColor(rowFocused, 'Error')

        console.log(err)
      }
    } else if (valueInD === 'Reject') {
      setStatusColor(rowFocused, 'Reject')

      statusRange.setValue('Từ chối gửi');
    }
  }
}

function setStatusColor(range, status) {
  switch(status) {
    case 'Reject':
      range.setBackground(COLOR_REJECT_BG)
      range.setFontColor(COLOR_REJECT_FONT)
      break;
    case 'Approve':
      range.setBackground(COLOR_APPROVE_BG)
      range.setFontColor(COLOR_APPROVE_FONT)
      break;
    case 'Error':
      range.setBackground(COLOR_ERROR_BG)
      range.setFontColor(COLOR_ERROR_FONT)
      break;
    case 'Empty':
      range.setBackground(COLOR_EMPTY_BG)
      range.setFontColor(COLOR_EMPTY_FONT)
      break;
  }
}
