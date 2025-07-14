// 물리 상수
const g = 9.81; // 중력가속도 (m/s²)

// 탭 전환 함수
function showTab(tabName, clickedTab) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    clickedTab.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// 단위 변환 함수
function msToKmh(speedMs) {
    return speedMs * 3.6;
}

function kmhToMs(speedKmh) {
    return speedKmh / 3.6;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

// 자동차 계산
function calculateCar() {
    const radius = parseFloat(document.getElementById('car-radius').value);
    const friction = parseFloat(document.getElementById('car-surface').value);
    const bankAngleDeg = parseFloat(document.getElementById('car-bank').value);
    const bankAngle = degToRad(bankAngleDeg);

    let resultHTML = '';

    if (bankAngleDeg === 0) {
        // 평탄한 도로
        const vMax = Math.sqrt(friction * g * radius);
        resultHTML = `
            <div class="result-item">
                <span class="result-label">최대 안전 속도</span>
                <span class="result-value">${vMax.toFixed(2)} m/s (${msToKmh(vMax).toFixed(1)} km/h)</span>
            </div>
            <div class="result-item">
                <span class="result-label">권장 속도 (80%)</span>
                <span class="result-value">${(vMax * 0.8).toFixed(2)} m/s (${msToKmh(vMax * 0.8).toFixed(1)} km/h)</span>
            </div>
        `;
    } else {
        // 뱅크각이 있는 도로
        const vIdeal = Math.sqrt(g * radius * Math.tan(bankAngle));

        const numeratorMax = Math.tan(bankAngle) + friction;
        const denominatorMax = 1 - friction * Math.tan(bankAngle);
        let vMax, vMaxDisplay;

        if (denominatorMax <= 0) {
            vMaxDisplay = "제한 없음";
        } else {
            vMax = Math.sqrt(g * radius * numeratorMax / denominatorMax);
            vMaxDisplay = `${vMax.toFixed(2)} m/s (${msToKmh(vMax).toFixed(1)} km/h)`;
        }

        const numeratorMin = Math.tan(bankAngle) - friction;
        const denominatorMin = 1 + friction * Math.tan(bankAngle);
        let vMin = 0;

        if (numeratorMin > 0) {
            vMin = Math.sqrt(g * radius * numeratorMin / denominatorMin);
        }

        resultHTML = `
            <div class="result-item">
                <span class="result-label">이상적 속도 (마찰 없음)</span>
                <span class="result-value">${vIdeal.toFixed(2)} m/s (${msToKmh(vIdeal).toFixed(1)} km/h)</span>
            </div>
            <div class="result-item">
                <span class="result-label">최소 안전 속도</span>
                <span class="result-value">${vMin.toFixed(2)} m/s (${msToKmh(vMin).toFixed(1)} km/h)</span>
            </div>
            <div class="result-item">
                <span class="result-label">최대 안전 속도</span>
                <span class="result-value">${vMaxDisplay}</span>
            </div>
        `;
    }

    document.getElementById('car-result-content').innerHTML = resultHTML;
    document.getElementById('car-result').style.display = 'block';
}

// 자전거 계산
function calculateBicycle() {
    const radius = parseFloat(document.getElementById('bike-radius').value);
    const speedKmh = parseFloat(document.getElementById('bike-speed').value);
    const maxLeanDeg = parseFloat(document.getElementById('bike-max-lean').value);
    const speedMs = kmhToMs(speedKmh);

    const requiredLeanRad = Math.atan(speedMs * speedMs / (g * radius));
    const requiredLeanDeg = radToDeg(requiredLeanRad);

    const maxLeanRad = degToRad(maxLeanDeg);
    const vMax = Math.sqrt(g * radius * Math.tan(maxLeanRad));

    let safetyStatus = '';
    let statusColor = '';

    if (requiredLeanDeg <= maxLeanDeg * 0.7) {
        safetyStatus = '안전';
        statusColor = 'green';
    } else if (requiredLeanDeg <= maxLeanDeg * 0.9) {
        safetyStatus = '주의 필요';
        statusColor = 'orange';
    } else if (requiredLeanDeg <= maxLeanDeg) {
        safetyStatus = '위험';
        statusColor = 'red';
    } else {
        safetyStatus = '불가능';
        statusColor = 'darkred';
    }

    const resultHTML = `
        <div class="result-item">
            <span class="result-label">필요한 기울임 각도</span>
            <span class="result-value">${requiredLeanDeg.toFixed(1)}°</span>
        </div>
        <div class="result-item">
            <span class="result-label">안전 상태</span>
            <span class="result-value" style="color: ${statusColor}; font-weight: bold;">${safetyStatus}</span>
        </div>
        <div class="result-item">
            <span class="result-label">최대 가능 속도 (${maxLeanDeg}° 기울임)</span>
            <span class="result-value">${vMax.toFixed(2)} m/s (${msToKmh(vMax).toFixed(1)} km/h)</span>
        </div>
    `;

    document.getElementById('bicycle-result-content').innerHTML = resultHTML;
    document.getElementById('bicycle-result').style.display = 'block';
}

// 달리기 계산
function calculateRunning() {
    const radius = parseFloat(document.getElementById('run-radius').value);
    const straightSpeedKmh = parseFloat(document.getElementById('run-straight-speed').value);
    const bankAngleDeg = parseFloat(document.getElementById('run-bank').value);
    const straightSpeedMs = kmhToMs(straightSpeedKmh);

    const efficiency = 0.85;
    const curveSpeed = straightSpeedMs * efficiency * Math.sqrt(radius / (radius + 10));

    let resultHTML = `
        <div class="result-item">
            <span class="result-label">직선 속도</span>
            <span class="result-value">${straightSpeedMs.toFixed(2)} m/s (${straightSpeedKmh.toFixed(1)} km/h)</span>
        </div>
        <div class="result-item">
            <span class="result-label">예상 곡선 속도</span>
            <span class="result-value">${curveSpeed.toFixed(2)} m/s (${msToKmh(curveSpeed).toFixed(1)} km/h)</span>
        </div>
        <div class="result-item">
            <span class="result-label">속도 감소율</span>
            <span class="result-value">${((1 - curveSpeed/straightSpeedMs) * 100).toFixed(1)}%</span>
        </div>
    `;

    if (bankAngleDeg > 0) {
        const bankAngle = degToRad(bankAngleDeg);
        const optimalSpeed = Math.sqrt(g * radius * Math.tan(bankAngle));

        resultHTML += `
            <div class="result-item" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <span class="result-label">뱅크 트랙 최적 속도</span>
                <span class="result-value">${optimalSpeed.toFixed(2)} m/s (${msToKmh(optimalSpeed).toFixed(1)} km/h)</span>
            </div>
        `;
    }

    document.getElementById('running-result-content').innerHTML = resultHTML;
    document.getElementById('running-result').style.display = 'block';
}

// 종합 비교
function compareAll() {
    const radius = parseFloat(document.getElementById('compare-radius').value);
    const friction = parseFloat(document.getElementById('compare-surface').value);

    const carMaxSpeed = Math.sqrt(friction * g * radius);

    const bikeLeanRad = degToRad(45);
    const bikeMaxSpeed = Math.sqrt(g * radius * Math.tan(bikeLeanRad));

    const typicalRunSpeed = 5.0; // m/s
    const runCurveSpeed = typicalRunSpeed * 0.85 * Math.sqrt(radius / (radius + 10));

    const resultHTML = `
        <div class="grid">
            <div style="background: #f0f0f0; padding: 15px; border-radius: 10px;">
                <h4 style="color: #333; margin-bottom: 10px;">🚗 자동차</h4>
                <p>최대 속도: ${carMaxSpeed.toFixed(2)} m/s (${msToKmh(carMaxSpeed).toFixed(1)} km/h)</p>
                <p>권장 속도: ${(carMaxSpeed * 0.8).toFixed(2)} m/s (${msToKmh(carMaxSpeed * 0.8).toFixed(1)} km/h)</p>
            </div>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 10px;">
                <h4 style="color: #333; margin-bottom: 10px;">🚴‍♂️ 자전거</h4>
                <p>최대 속도 (45° 기울임): ${bikeMaxSpeed.toFixed(2)} m/s (${msToKmh(bikeMaxSpeed).toFixed(1)} km/h)</p>
                <p>안전 속도 (35° 기울임): ${(bikeMaxSpeed * 0.8).toFixed(2)} m/s (${msToKmh(bikeMaxSpeed * 0.8).toFixed(1)} km/h)</p>
            </div>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 10px;">
                <h4 style="color: #333; margin-bottom: 10px;">🏃‍♂️ 달리기</h4>
                <p>직선 속도: ${typicalRunSpeed.toFixed(2)} m/s (${msToKmh(typicalRunSpeed).toFixed(1)} km/h)</p>
                <p>곡선 속도: ${runCurveSpeed.toFixed(2)} m/s (${msToKmh(runCurveSpeed).toFixed(1)} km/h)</p>
            </div>
        </div>
    `;

    document.getElementById('compare-result-content').innerHTML = resultHTML;
    document.getElementById('compare-result').style.display = 'block';
}

// 페이지 로드 시 첫 번째 탭의 계산을 기본으로 실행
window.onload = function() {
    calculateCar();
};