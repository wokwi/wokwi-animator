function createUrl(content: string, contentType: string) {
  try {
    return URL.createObjectURL(new Blob([content], { type: contentType }));
  } catch (e) {
    return `data:${contentType};base64,` + btoa(content);
  }
}

export function downloadFile(
  filename: string,
  content: string,
  contentType: string = 'application/octet-stream',
) {
  if (window.navigator.msSaveOrOpenBlob) {
    // IE
    window.navigator.msSaveOrOpenBlob(new Blob([content], { type: contentType }), filename);
  } else {
    /* Other browsers */
    const link: HTMLAnchorElement = document.createElement('a');
    link.download = filename;
    link.href = createUrl(content, contentType);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
