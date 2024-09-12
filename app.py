from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

def interpolasi_linier(x0, y0, x1, y1, x):
    if x0 == x1:
        if y0 == y1:
            return y0  # Jika x0 == x1 dan y0 == y1, kembalikan y0
        else:
            raise ValueError("x0 dan x1 tidak boleh sama kecuali y0 juga sama dengan y1")  # Jika x0 == x1 tetapi y0 != y1, ini tidak valid untuk interpolasi
    # Menggunakan rumus interpolasi linier
    f_x = y0 + ((y1 - y0) / (x1 - x0)) * (x - x0)
    return f_x

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/interpolasi', methods=['POST'])
def interpolasi():
    try:
        data = request.get_json()
        # Mengambil nilai dari permintaan (request)
        x0 = float(data['x0'])  # Titik pertama pada sumbu x0
        y0 = float(data['y0'])  # Nilai fungsi pada titik pertama (x0)
        x1 = float(data['x1'])  # Titik kedua pada sumbu x1
        y1 = float(data['y1'])  # Nilai fungsi pada titik kedua (x1)
        x = float(data['x'])    # Titik x yang akan diinterpolasi

        hasil = interpolasi_linier(x0, y0, x1, y1, x)
        return jsonify({'hasil': hasil, 'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1, 'x': x, 'fx': hasil})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
