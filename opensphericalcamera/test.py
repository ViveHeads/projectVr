from osc.theta import RicohThetaS

thetas = RicohThetaS()
thetas.state()
thetas.info()
import pdb;pdb.set_trace()
# Capture image
thetas.setCaptureMode( 'image' )
response = thetas.takePicture()

# Wait for the stitching to finish
thetas.waitForProcessing(response['id'])

# Copy image to computer
thetas.getLatestImage()

# Stream the livePreview video to disk
# for 3 seconds
# thetas.getLivePreview(timeLimitSeconds=3)

# Capture video
# thetas.setCaptureMode( '_video' )
# thetas.startCapture()
# thetas.stopCapture()

# Copy video to computer
# thetas.getLatestVideo()

# Close the session
thetas.closeSession()