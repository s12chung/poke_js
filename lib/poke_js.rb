require "poke_js/view_helpers"
require "poke_js/controller"

module PokeJs
  if defined?(Rails) && defined?(Rails::Engine)
    class Engine < ::Rails::Engine
      initializer "poke_js.view_helpers" do
        ActionView::Base.send :include, ViewHelpers
      end
    end
  end
end