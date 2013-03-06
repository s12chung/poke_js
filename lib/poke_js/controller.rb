module PokeJs
  module Controller
    extend ActiveSupport::Concern
    included do
      helper_method :poke_js_template
      helper_method :extract_template
    end

    def poke_js_template
      extract_template(@poke_js_template)
    end

    protected
    def extract_template(template)
      extracted_template = [controller_path, action_name]
      if template
        array = if template.class == Array
                  template
                else
                  split = template.to_s.split('/')
                  template_controller = split[0..-2]
                  unless template_controller.empty?
                    template_controller = [template_controller.join('/')]
                  end
                  template_controller + [split.last]
                end
        if array.size == 1
          extracted_template[1] = array.first
        else
          extracted_template = array
        end
      end
      extracted_template
    end
  end
end

::ActionController::Base.send :include, PokeJs::Controller