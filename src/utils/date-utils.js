// 날짜 문자열을 받아서 "일"을 반환한다.
export function getDay(dateString) {
    const date = new Date(dateString);
    return date.getDate();
}

// 날짜 문자열을 받아서 "YYYY년 m월, 요일" 형태로 반환한다.
export function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0에서 11까지의 값을 반환하기 때문에 1을 더한다.
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const day = dayNames[date.getDay()];
    return `${year}년 ${month}월, ${day}`;
}

// 날짜 문자열을 "연 월 일 오전|오후 시 분" 형태로 반환
export function formatDateAndTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // getMonth()는 0에서 11까지의 값을 반환하기 때문에 1을 더한다.
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? '오후' : '오전';

    // 12시간제로 변환
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${year}년 ${month}월 ${day}일 ${ampm} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}