class IncomingMailsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    Rails.logger.debug params.inspect
    Rails.logger.debug "Received: #{mail_params[:headers][:subject]} for #{mail_params[:envelope][:to]}"
  end

  protected

  # We might need to permit parameters here because we're going
  # to ensure only CloudMailin can post we will permit all here.
  # You might want to review this yourself.
  def mail_params
    params.permit!
  end
end
