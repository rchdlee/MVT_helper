# # CROP & RESIZE VIDEO

# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# from moviepy.video.io.VideoFileClip import VideoFileClip
# # from moviepy.video.fx import crop, resize
# from moviepy.video.fx import crop  # Correct import statement
# from moviepy.video.fx import resize  # Correct import statement
# import os
# import uuid


from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
# from moviepy.video.io.VideoFileClip import VideoFileClip
# # from moviepy.editor import resize
# # from moviepy.video.fx.Crop import Crop
# from moviepy.video.fx import crop, resize
from moviepy import VideoFileClip
from moviepy import vfx, afx

import os
import shutil
import uuid
import logging

from werkzeug.utils import secure_filename
import tempfile
import json

app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173"])
# CORS(app, 
#     resources={r"/capture": {"origins": "http://localhost:5173"}},
#     supports_credentials=True
# )
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Enable debug logging
app.logger.setLevel(logging.DEBUG)

def clear_screenshots_folder():
    """Clear the contents of the screenshots folder."""
    screenshots_folder = "screenshots"
    if os.path.exists(screenshots_folder):
        # Remove all files and subdirectories in the screenshots folder
        for filename in os.listdir(screenshots_folder):
            file_path = os.path.join(screenshots_folder, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)  # Delete the file or symbolic link
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)  # Delete the directory and its contents
            except Exception as e:
                print(f"Failed to delete {file_path}. Reason: {e}")
    else:
        # Create the screenshots folder if it doesn't exist
        os.makedirs(screenshots_folder)

def capture_screenshots(video_path, time_points_arrays, mouse_IDs): # multiple time point arrays
    results = []

    # Loop through each set of time points
    for index, time_points in enumerate(time_points_arrays):
        # Generate a unique folder name with the index as an identifier
        # folder_name = f"mouse_{index + 1}_{uuid.uuid4()}"  # Include index in folder name
        folder_name = "stats" if index == 0 else f"position{index}_{mouse_IDs[index]}"
        output_folder = os.path.join("screenshots", folder_name)
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        try:
            # Load the video file
            video = VideoFileClip(video_path)
            width, height = video.size

            print(width, height, '🪻')

            # video = video.with_effects([vfx.Crop(0,0,width/2,height/2)])
            # video = video.with_effects([vfx.Resize([3024, 1964])])
            video = video.with_effects([vfx.Resize(2)])
            # width, height = video.size
            # resized_video = resize(video, newsize=(width * 2, height * 2))
            
            # Apply the crop effect using the fx method
            # cropped_video = crop(video, x1=0, y1=0, x2=300, y2=300)
            
            screenshots = []

            # Loop through the specified time points and capture screenshots
            for i, time_point in enumerate(time_points):
                # Ensure the time point is within the video duration
                if float(time_point) < 0 or float(time_point) > video.duration:
                # if time_point < 0 or time_point > resized_video.duration:
                # if time_point < 0 or time_point > cropped_video.duration:
                    app.logger.warning(f"Time point {time_point} is out of bounds for video.")
                    continue
                    
                # Capture the frame at the specified time using the cropped video
               
                output_path = os.path.join(output_folder, f"{mouse_IDs[index]}_frame{i+1}_{time_point}.png")
                # print(video)
                video.save_frame(output_path, t=time_point)
                # resized_video.save_frame(output_path, t=time_point)
                # cropped_video.save_frame(output_path, t=time_point)
                screenshots.append(output_path)

            # Close the video files
            # cropped_video.close()
            # resized_video.close()
            video.close()

            # Save the results for this set of time points
            results.append({
                "folder_name": folder_name,
                "screenshots": screenshots
            })

        except Exception as e:
            app.logger.error(f"Error processing video: {str(e)}")
            raise e

    return results

def capture_screenshots_single(video_path, time_points_array): # for Screenshots from CSV functionality
    results = []

    folder_name = "screenshots_from_csv"
    output_folder = os.path.join("screenshots", folder_name)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    try:
        #Load video file
        video = VideoFileClip(video_path)
        width, height = video.size

        video = video.with_effects([vfx.Resize(2)])

        screenshots = []

        for i, time_point in enumerate(time_points_array):
            if time_point < 0 or time_point > video.duration:
                app.logger.warning(f"Time point {time_point} is out of bounds for video.")
                continue
            
            output_path = os.path.join(output_folder, f"screenshot_{i+1}_{time_point}_sec.png")
            video.save_frame(output_path, t=time_point)
            screenshots.append(output_path)

        video.close()

        results.append({
            "folder_name": folder_name,
            "screenshots": screenshots
        })
    
    except Exception as e:
        app.logger.error(f"Error processing video: {str(e)}")
        raise e

    return results


@app.route('/capture', methods=['POST'])
def capture():
    # data = request.json
    # video_path = data.get('video_path')
    # time_points_arrays = data.get('time_points_arrays')
    # mouse_IDs = data.get("mouse_IDs")

    video_file = request.files["video"]
    time_points_arrays = json.loads(request.form["time_points_arrays"])
    mouse_IDs = json.loads(request.form["mouse_IDs"])

    if not video_file or not time_points_arrays:
        return jsonify({"error": "Missing video_path or time_points_arrays"}), 400
    
    # temp_dir = os.path.join(tempfile.gettempdir(), "test_finished")
    # os.makedirs(temp_dir, exist_ok=True)
    
    # # temp_path = os.path.join(tempfile.gettempdir(), video_file.filename)
    # temp_path = os.path.join(temp_dir, video_file.filename)
    # video_file.save(temp_path)

    # temp_dir = os.path.join(tempfile.gettempdir(), "test_finished")
    temp_dir = tempfile.gettempdir()
    os.makedirs(temp_dir, exist_ok=True)

    # Strip any folder paths sent by the browser
    raw_name = video_file.filename
    just_name = os.path.basename(raw_name)      # <-- removes test_finished/ prefix
    safe_name = secure_filename(just_name)      # <-- removes weird characters

    temp_path = os.path.join(temp_dir, safe_name)

    video_file.save(temp_path)

    clear_screenshots_folder()

    try:
        # Process all sets of time points
        results = capture_screenshots(temp_path, time_points_arrays, mouse_IDs)
        return jsonify({"results": results})
    except Exception as e:
        app.logger.error(f"Error capturing screenshots: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/capture_single', methods=['POST'])    
def capture_single():
    data = request.json
    video_path = data.get('video_path')
    time_points_array = data.get('time_points_array')

    if not video_path or not time_points_array:
        return jsonify({"error": "Missing video_path or time_points_arrays"}), 400
    
    clear_screenshots_folder()

    try:
        # Process all sets of time points
        results = capture_screenshots_single(video_path, time_points_array)
        return jsonify({"results": results})
    except Exception as e:
        app.logger.error(f"Error capturing screenshots: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from moviepy.video.io.VideoFileClip import VideoFileClip
# import os
# import uuid  # To generate unique folder names
# from moviepy.video.fx.Crop import Crop

# import logging


# app = Flask(__name__)
# CORS(app)
# app.logger.setLevel(logging.DEBUG)  # Enable debug logging


# def capture_screenshots(video_path, time_points_arrays):
#     results = []

#     # Loop through each set of time points
#     for index, time_points in enumerate(time_points_arrays):
#         # Generate a unique folder name with the index as an identifier
#         folder_name = f"mouse_{index + 1}_{uuid.uuid4()}"  # Include index in folder name
#         output_folder = os.path.join("screenshots", folder_name)
#         if not os.path.exists(output_folder):
#             os.makedirs(output_folder)

#         # Load the video file
#         video = VideoFileClip(video_path)
#         # cropped_video = Crop(video, 0, 0,300,300)
#         # cropped_video = Crop(video, x1=0, y1=0, x2=300, y2=300)
#         cropped_video = video.fx(Crop, x1=0, y1=0, x2=300, y2=300)
#         # cropped_video = Crop(video, x1=crop_area[0], y1=crop_area[1], x2=crop_area[2], y2=crop_area[3])
#         screenshots = []

#     # Loop through the specified time points and capture screenshots
#         for i, time_point in enumerate(time_points):
#             # Ensure the time point is within the video duration
#             if time_point < 0 or time_point > cropped_video.duration:
#             # if time_point < 0 or time_point > video.duration:
#                 continue

#             # Capture the frame at the specified time using the cropped video
#             output_path = os.path.join(output_folder, f"frame_{i+1}_{time_point}.png")
#             cropped_video.save_frame(output_path, t=time_point)
#             # video.save_frame(output_path, t=time_point)
#             screenshots.append(output_path)

#         # Close the video file
#         cropped_video.close()
#         video.close()

#         # Save the results for this set of time points
#         results.append({
#             "folder_name": folder_name,
#             "screenshots": screenshots
#         })

#     return results

# @app.route('/capture', methods=['POST'])
# def capture():
#     data = request.json
#     video_path = data.get('video_path')
#     time_points_arrays = data.get('time_points_arrays')

#     if not video_path or not time_points_arrays:
#         return jsonify({"error": "Missing video_path or time_points_arrays"}), 400

#     try:
#         # Process all sets of time points
#         results = capture_screenshots(video_path, time_points_arrays)
#         return jsonify({"results": results})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

# from flask import Flask, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/api/data')
# def get_data():
#     return jsonify({"message": "Hello from Flask!"})

# if __name__ == '__main__':
#     app.run(debug=True)