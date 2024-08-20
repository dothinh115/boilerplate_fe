import type Editor from "@tinymce/tinymce-vue";

export const useMention = (editor: typeof Editor) => {
  let isMentioning = false;
  let mentionText = "";
  //lấy text từ block hiện tại
  const currenBlockText = getCurrentBlockInfo(editor);
  let cursorPosition = { start: 0, end: 0 };

  if (currenBlockText) {
    //lấy range của editor
    const selection = editor.selection.getRng();

    //lấy vị trí con trỏ trên block
    const startPos = selection.startOffset;

    // Lấy từ trước vị trí con trỏ
    const textBeforeCursor = currenBlockText.slice(0, startPos);
    // Kiểm tra nếu người dùng gõ "@"
    const mentionInfo = checkMention(textBeforeCursor);
    isMentioning = mentionInfo.isMentioning;
    mentionText = mentionInfo.mentionText;
    cursorPosition = {
      start: selection.startOffset - mentionText.length - 1,
      end: selection.endOffset,
    };
  }

  return {
    isMentioning,
    mentionText,
    cursorPosition,
  };
};

const getCurrentBlockInfo = (editor: typeof Editor) => {
  const selection = editor.selection;
  const node = selection.getNode(); // Lấy node hiện tại
  const block = editor.dom.getParent(node, editor.dom.isBlock); // Lấy block chứa node hiện tại

  if (block) {
    return block.textContent || ""; // Nội dung văn bản (text) của block
  }
  return null;
};

const checkMention = (text: string) => {
  //regex khớp với @+(số hoặc chữ)+(khoảng trắng)
  const mentionMatch = text.match(/@([\p{L}\p{N}])$/u);
  if (!mentionMatch) {
    return {
      isMentioning: false,
      mentionText: "",
    };
  }

  const mentionText = mentionMatch[1].trim(); // Trích xuất phần văn bản sau dấu '@'
  //cho phép 3 khoảng trắng, trong trường hợp người dùng ko phải đang mention
  const hasThreeOrMoreSpaces = (mentionText.match(/\s/g) || []).length >= 3;

  return {
    isMentioning: !hasThreeOrMoreSpaces,
    mentionText: hasThreeOrMoreSpaces ? "" : mentionText,
  };
};
