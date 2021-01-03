class TextEditor {
  constructor() {
    this.$textEditor = $('#text-editor');
    this.cursorIntervalID;
    this.bindEvents();
  }

  bindEvents() {
    this.$textEditor.on('click', $.proxy(this.handlTextEditorClick, this));
    $(document).on('click', $.proxy(this.handleOutsideClick, this));
    $(document).on('keydown', $.proxy(this.handleKeyDown, this));
  }

  handlTextEditorClick() {
    this.$textEditor.addClass('focused');
    clearInterval(this.cursorIntervalID);
    let $cursor = this.$textEditor.find('div:last-of-type').find('p:last-of-type')
    this.setCursor($cursor);
  } 

  setCursor($newCursor, $oldCursor = null) {
    if ($oldCursor) {
      clearInterval(this.cursorIntervalID);
      $oldCursor.removeClass('cursor');
      $oldCursor.removeAttr('id');
    }

    $newCursor.attr('id', 'cursor');
    this.cursorIntervalID = setInterval(() => {
      $newCursor.toggleClass('cursor');
    }, 350);
  }

  handleOutsideClick(event) {
    if ($(event.target).closest('#text-editor').length === 0) {
      clearInterval(this.cursorIntervalID);
      $('.cursor').removeClass('cursor');
      this.$textEditor.removeClass('focused');
    }
  }

  handleKeyDown(event) {
    if (event.key.length === 1) {
      this.addChar(event.key);
    } else if (event.key === "Backspace") {
      this.backSpace();
    } else if (event.key === "Tab") {
      event.preventDefault();
      this.tab();
    }
  }

  addChar(char) {
    clearInterval(this.cursorIntervalID);
    let $oldCursor = $('#cursor');
    let $newCursor = $('<p></p>');
    if (char === ' ') {
      $oldCursor.addClass('space');
    } else {
      $oldCursor.text(char);
    }

    $newCursor.insertAfter($oldCursor);
    this.setCursor($newCursor, $oldCursor);
  }

  backSpace() {
    if (this.noText()) {
      return;
    }

    let $newCursor = $('#cursor').prev();
    $('#cursor').remove();
    $newCursor.removeClass('space');
    $newCursor.text('');
    this.setCursor($newCursor);
  }

  noText() {
    return (this.$textEditor.text().trim() === "") &&
           ($('.space').length === 0);
  }

  tab() {
    let $newCursor = $('<p></p>');
    let $oldCursor = $('#cursor');
    $oldCursor.addClass('space');
    $(`${'<p class="space"></p>'.repeat(3)}`).insertBefore($oldCursor);
    $newCursor.insertAfter($oldCursor);
    this.setCursor($newCursor, $oldCursor);
  }
}

$(() => new TextEditor);